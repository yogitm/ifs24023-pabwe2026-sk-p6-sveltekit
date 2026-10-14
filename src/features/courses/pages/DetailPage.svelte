<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { coursesStore } from "../states/coursesStore";
  import { usersStore } from "../../users/states/usersStore";
  import { showConfirmDialog } from "../../../helpers/toolsHelper";
  import MarkdownViewer from "../components/MarkdownViewer.svelte";
  import ChangeCoverModal from "../modals/ChangeCoverModal.svelte";
  import ChangeModal from "../modals/ChangeModal.svelte";
  import ContentModal from "../modals/ContentModal.svelte";
  import RatingModal from "../modals/RatingModal.svelte";
  import {
    ArrowLeft,
    GraduationCap,
    Users,
    Star,
    BookOpen,
    Camera,
    Pencil,
    Trash2,
    Plus,
    Video,
    CheckCircle2,
    Circle,
    UserCheck,
    LogOut,
    Eye,
    LoaderCircle,
  } from "lucide-svelte";
  import type { CourseContent } from "../api/courseApi";

  export let courseId: string | number | null = null;

  let showChangeCoverModal: boolean = false;
  let showChangeModal: boolean = false;
  let showContentModal: boolean = false;
  let showRatingModal: boolean = false;
  let selectedContent: CourseContent | null = null;

  $: profile = $usersStore.profile;
  $: course = $coursesStore.course;

  onMount(() => {
    if (courseId) {
      coursesStore.asyncSetCourse(courseId);
    }
  });

  $: if ($coursesStore.isCourseDeleted) {
    coursesStore.setIsCourseDeleted(false);
    goto("/");
  }

  $: if ($coursesStore.isCourseStudentJoin) {
    coursesStore.setIsCourseStudentJoin(false);
    if ($coursesStore.isCourseStudentJoined && courseId) {
      coursesStore.setIsCourseStudentJoined(false);
      coursesStore.asyncSetCourse(courseId);
    }
  }

  $: if ($coursesStore.isCourseStudentLeave) {
    coursesStore.setIsCourseStudentLeave(false);
    if ($coursesStore.isCourseStudentLeft && courseId) {
      coursesStore.setIsCourseStudentLeft(false);
      coursesStore.asyncSetCourse(courseId);
    }
  }

  $: if ($coursesStore.isCourseContentDelete) {
    coursesStore.setIsCourseContentDelete(false);
    if ($coursesStore.isCourseContentDeleted && courseId) {
      coursesStore.setIsCourseContentDeleted(false);
      coursesStore.asyncSetCourse(courseId);
    }
  }

  $: isOwner = Boolean(profile && course && course.user_id === profile.id);
  $: isStudent = Boolean(
    profile &&
      course &&
      course.students &&
      course.students.includes(profile.id)
  );

  async function handleDeleteCourse() {
    const result = await showConfirmDialog("Apakah Anda yakin ingin menghapus kursus ini?");
    if (result.isConfirmed) {
      coursesStore.asyncSetIsCourseDelete(course.id);
    }
  }

  async function handleJoinCourse() {
    coursesStore.asyncSetIsCourseStudentJoin(course.id);
  }

  async function handleLeaveCourse() {
    const result = await showConfirmDialog("Apakah Anda yakin ingin keluar dari kursus ini?");
    if (result.isConfirmed) {
      coursesStore.asyncSetIsCourseStudentLeave(course.id);
    }
  }

  function handleAddContent() {
    selectedContent = null;
    showContentModal = true;
  }

  function handleEditContent(content: CourseContent) {
    selectedContent = content;
    showContentModal = true;
  }

  async function handleDeleteContent(contentId: string | number) {
    const result = await showConfirmDialog("Apakah Anda yakin ingin menghapus konten materi ini?");
    if (result.isConfirmed) {
      coursesStore.asyncSetIsCourseContentDelete(contentId);
    }
  }
</script>

<div class="space-y-6 animate-in fade-in duration-300">
  <!-- Back Button Navigation -->
  <div>
    <button
      type="button"
      data-testid="back-button"
      on:click={() => goto("/")}
      class="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors"
    >
      <ArrowLeft size={16} />
      <span>Kembali ke Semua Kursus</span>
    </button>
  </div>

  {#if !course}
    <div class="flex flex-col items-center justify-center py-24 text-slate-400">
      <LoaderCircle size={36} class="animate-spin text-indigo-600 mb-3" />
      <p class="text-sm font-medium">Memuat detail kursus...</p>
    </div>
  {:else}
    <!-- Course Banner & Header Card -->
    <div class="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
      <!-- Cover Banner -->
      <div class="h-64 sm:h-80 bg-gradient-to-tr from-indigo-800 via-indigo-950 to-slate-900 relative">
        {#if course.cover}
          <img
            src={course.cover}
            alt={course.title}
            class="w-full h-full object-cover"
          />
        {:else}
          <div class="w-full h-full flex flex-col items-center justify-center text-white/30">
            <GraduationCap size={72} strokeWidth={1.5} />
          </div>
        {/if}

        {#if isOwner}
          <button
            type="button"
            data-testid="change-cover-btn"
            on:click={() => (showChangeCoverModal = true)}
            class="absolute bottom-4 right-4 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-semibold backdrop-blur-md transition-all shadow-lg"
          >
            <Camera size={15} />
            <span>Ubah Cover</span>
          </button>
        {/if}
      </div>

      <!-- Course Header Details -->
      <div class="p-6 sm:p-8 space-y-6">
        <div class="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div class="space-y-3 flex-1">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200/60">
                <Star size={13} class="fill-amber-500 text-amber-500" />
                <span>Rating: {course.avg_ratings ? Number(course.avg_ratings).toFixed(1) : "0.0"}</span>
              </span>

              {#if isStudent}
                <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200/60">
                  <UserCheck size={13} />
                  <span>Terdaftar sebagai Siswa</span>
                </span>
              {/if}

              {#if isOwner}
                <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200/60">
                  <span>Pemilik Kursus</span>
                </span>
              {/if}
            </div>

            <h1 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {course.title}
            </h1>

            <div class="flex items-center gap-6 text-xs text-slate-500 flex-wrap">
              <div class="flex items-center gap-2">
                <div class="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-500 text-white flex items-center justify-center font-bold text-[10px]">
                  {course.author?.name ? course.author.name.charAt(0).toUpperCase() : "A"}
                </div>
                <span class="font-semibold text-slate-700">{course.author?.name || "Pengajar"}</span>
              </div>

              <div class="flex items-center gap-1.5">
                <Users size={15} class="text-slate-400" />
                <span>{course.students ? course.students.length : 0} Siswa Terdaftar</span>
              </div>

              <div class="flex items-center gap-1.5">
                <BookOpen size={15} class="text-slate-400" />
                <span>{course.contents ? course.contents.length : 0} Modul Video</span>
              </div>
            </div>
          </div>

          <!-- Action Buttons (Owner vs Student) -->
          <div class="flex items-center gap-3 shrink-0 flex-wrap">
            {#if isOwner}
              <button
                type="button"
                data-testid="edit-course-btn"
                on:click={() => (showChangeModal = true)}
                class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                <Pencil size={16} />
                <span>Ubah Kursus</span>
              </button>
              <button
                type="button"
                data-testid="delete-course-btn"
                on:click={handleDeleteCourse}
                class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
              >
                <Trash2 size={16} />
                <span>Hapus Kursus</span>
              </button>
            {:else if isStudent}
              <button
                type="button"
                data-testid="rate-course-btn"
                on:click={() => (showRatingModal = true)}
                class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors"
              >
                <Star size={16} class="fill-amber-500" />
                <span>Beri Rating</span>
              </button>
              <button
                type="button"
                data-testid="leave-course-btn"
                on:click={handleLeaveCourse}
                class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
              >
                <LogOut size={16} />
                <span>Keluar Kursus</span>
              </button>
            {:else}
              <button
                type="button"
                data-testid="join-course-btn"
                on:click={handleJoinCourse}
                class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/25 transition-all"
              >
                <Plus size={18} strokeWidth={2.5} />
                <span>Gabung Kursus Ini</span>
              </button>
            {/if}
          </div>
        </div>

        {#if isStudent && course.my_percentage_finished !== undefined}
          <!-- Progress Bar -->
          <div class="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100/60 space-y-2">
            <div class="flex items-center justify-between text-xs font-bold text-indigo-900">
              <span>Progres Belajar Anda</span>
              <span>{course.my_percentage_finished}% Selesai</span>
            </div>
            <div class="w-full h-2.5 rounded-full bg-indigo-100 overflow-hidden">
              <div
                class="h-full bg-indigo-600 rounded-full transition-all duration-500"
                style={`width: ${course.my_percentage_finished}%`}
              ></div>
            </div>
          </div>
        {/if}

        <!-- Course Description (Markdown) -->
        <div class="pt-6 border-t border-slate-100 space-y-3">
          <h3 class="text-sm font-bold uppercase tracking-wider text-slate-400">
            Deskripsi Silabus
          </h3>
          <div class="prose prose-slate max-w-none">
            <MarkdownViewer content={course.description} />
          </div>
        </div>
      </div>
    </div>

    <!-- Course Contents Section -->
    <div class="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-lg font-bold text-slate-900">
            Materi Pembelajaran (<span>{course.contents ? course.contents.length : 0}</span>)
          </h2>
          <p class="text-xs text-slate-500 mt-0.5">
            Daftar video materi dan modul belajar yang tersedia
          </p>
        </div>

        {#if isOwner}
          <button
            type="button"
            data-testid="add-content-btn"
            on:click={handleAddContent}
            class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-semibold text-xs text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/25 transition-all"
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>Tambah Video Materi</span>
          </button>
        {/if}
      </div>

      {#if !course.contents || course.contents.length === 0}
        <div class="p-8 rounded-2xl border border-dashed border-slate-200 text-center">
          <Video size={32} class="mx-auto text-slate-300 mb-2" />
          <p class="text-sm font-semibold text-slate-600">Belum ada video materi di kursus ini.</p>
        </div>
      {:else}
        <div class="divide-y divide-slate-100">
          {#each course.contents as item, index (item.id)}
            <div
              data-testid={`content-item-${item.id}`}
              class="py-4 flex items-center justify-between gap-4 hover:bg-slate-50/60 px-3 rounded-xl transition-colors"
            >
              <div class="flex items-center gap-3.5 min-w-0">
                <span class="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                  {index + 1}
                </span>

                <div class="min-w-0">
                  <h4 class="text-sm font-bold text-slate-800 truncate">
                    {item.title}
                  </h4>
                  <p class="text-xs text-slate-400 truncate">
                    {item.youtube}
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-2 shrink-0">
                {#if isStudent}
                  {#if item.my_status_finished}
                    <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-semibold">
                      <CheckCircle2 size={13} />
                      <span class="hidden sm:inline">Selesai</span>
                    </span>
                  {:else}
                    <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-medium">
                      <Circle size={13} />
                      <span class="hidden sm:inline">Belum</span>
                    </span>
                  {/if}
                {/if}

                <button
                  type="button"
                  data-testid={`view-content-btn-${item.id}`}
                  on:click={() => goto(`/courses/${course.id}/contents/${item.id}`)}
                  class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
                >
                  <Eye size={13} />
                  <span>Pelajari</span>
                </button>

                {#if isOwner}
                  <button
                    type="button"
                    data-testid={`edit-content-btn-${item.id}`}
                    on:click={() => handleEditContent(item)}
                    class="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 transition-colors"
                    title="Ubah Konten"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    type="button"
                    data-testid={`delete-content-btn-${item.id}`}
                    on:click={() => handleDeleteContent(item.id)}
                    class="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                    title="Hapus Konten"
                  >
                    <Trash2 size={14} />
                  </button>
                {/if}
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>

    <!-- Course Ratings / Reviews Section -->
    {#if course.ratings && course.ratings.length > 0}
      <div class="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-4">
        <h2 class="text-lg font-bold text-slate-900">
          Ulasan & Rating Siswa (<span>{course.ratings.length}</span>)
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          {#each course.ratings as r, i (i)}
            <div class="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-slate-800">{r.name}</span>
                <div class="flex items-center text-amber-400">
                  {#each Array(r.ratings) as _}
                    <Star size={12} class="fill-amber-400" />
                  {/each}
                </div>
              </div>
              {#if r.comment}
                <p class="text-xs text-slate-600">{r.comment}</p>
              {/if}
            </div>
          {/each}
        </div>
      </div>
    {/if}
  {/if}
</div>

<ChangeCoverModal
  show={showChangeCoverModal}
  {course}
  onClose={() => (showChangeCoverModal = false)}
  on:close={() => (showChangeCoverModal = false)}
/>

<ChangeModal
  show={showChangeModal}
  courseId={course?.id || null}
  onClose={() => (showChangeModal = false)}
  on:close={() => (showChangeModal = false)}
/>

<ContentModal
  show={showContentModal}
  courseId={course?.id || null}
  content={selectedContent}
  onClose={() => {
    showContentModal = false;
    selectedContent = null;
  }}
  on:close={() => {
    showContentModal = false;
    selectedContent = null;
  }}
/>

<RatingModal
  show={showRatingModal}
  courseId={course?.id || null}
  onClose={() => (showRatingModal = false)}
  on:close={() => (showRatingModal = false)}
/>
