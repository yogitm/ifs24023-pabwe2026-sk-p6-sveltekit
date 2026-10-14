<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import AddModal from "../modals/AddModal.svelte";
  import ChangeModal from "../modals/ChangeModal.svelte";
  import { coursesStore } from "../states/coursesStore";
  import { usersStore } from "../../users/states/usersStore";
  import { showConfirmDialog } from "../../../helpers/toolsHelper";
  import {
    Plus,
    GraduationCap,
    BookOpen,
    Users,
    Star,
    Eye,
    Pencil,
    Trash2,
    Search,
    LoaderCircle,
  } from "lucide-svelte";
  import type { Course } from "../api/courseApi";

  let loadingCourses: boolean = false;
  let filter: string = "";
  let searchQuery: string = "";
  let showAddModal: boolean = false;
  let showChangeModal: boolean = false;
  let selectedCourseId: string | number | null = null;

  $: profile = $usersStore.profile;
  $: courses = $coursesStore.courses;

  onMount(() => {
    loadCourses();
  });

  function loadCourses() {
    loadingCourses = true;
    Promise.resolve(coursesStore.asyncSetCourses(filter)).finally(() => {
      loadingCourses = false;
    });
  }

  let prevFilter = filter;
  $: if (filter !== prevFilter) {
    prevFilter = filter;
    loadCourses();
  }

  $: if ($coursesStore.isCourseDeleted) {
    coursesStore.setIsCourseDeleted(false);
    loadCourses();
  }

  $: if ($coursesStore.isCourseDeletedAll) {
    coursesStore.setIsCourseDeletedAll(false);
    loadCourses();
  }

  function handleEditCourse(courseId: string | number) {
    selectedCourseId = courseId;
    showChangeModal = true;
  }

  async function handleDeleteCourse(courseId: string | number) {
    const result = await showConfirmDialog("Apakah Anda yakin ingin menghapus kursus ini?");
    if (result.isConfirmed) {
      coursesStore.asyncSetIsCourseDelete(courseId);
    }
  }

  async function handleDeleteAllCourses() {
    const result = await showConfirmDialog(
      "Apakah Anda yakin ingin menghapus SEMUA kursus Anda? Tindakan ini tidak dapat dibatalkan!"
    );
    if (result.isConfirmed) {
      coursesStore.asyncSetIsCourseDeleteAll();
    }
  }

  $: filteredCourses = courses.filter((course: Course) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const title = course.title.toLowerCase();
    const description = course.description.toLowerCase();
    const author = course.author ? course.author.name.toLowerCase() : "";
    return title.includes(q) || description.includes(q) || author.includes(q);
  });

  $: totalCount = courses.length;
  $: myCoursesCount = profile
    ? courses.filter((c: Course) => c.user_id === profile.id).length
    : 0;
  $: enrolledCount = profile
    ? courses.filter((c: Course) => c.students && c.students.includes(profile.id)).length
    : 0;
</script>

{#if profile}
  <div class="space-y-8 animate-in fade-in duration-300">
    <!-- Header Banner -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Daftar Kursus
        </h1>
        <p class="text-sm text-slate-500 mt-1">
          Eksplorasi modul pembelajaran, tingkatkan kompetensi Anda, dan kelola kursus Anda.
        </p>
      </div>
      <div class="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
        <button
          type="button"
          data-testid="delete-all-courses-btn"
          on:click={handleDeleteAllCourses}
          class="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl font-semibold text-sm text-red-600 bg-red-50 hover:bg-red-100 active:bg-red-200 transition-all"
        >
          <Trash2 size={16} />
          <span>Hapus Semua</span>
        </button>

        <button
          type="button"
          data-testid="add-course-btn"
          on:click={() => (showAddModal = true)}
          class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-md shadow-indigo-600/25 transition-all"
        >
          <Plus size={18} strokeWidth={2.5} />
          <span>Tambah Kursus</span>
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Total Kursus
          </p>
          <h3 class="text-3xl font-black text-slate-800 mt-1">{totalCount}</h3>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
          <BookOpen size={26} strokeWidth={2} />
        </div>
      </div>

      <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Kursus Saya
          </p>
          <h3 class="text-3xl font-black text-indigo-600 mt-1">{myCoursesCount}</h3>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
          <GraduationCap size={26} strokeWidth={2} />
        </div>
      </div>

      <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Diikuti
          </p>
          <h3 class="text-3xl font-black text-emerald-600 mt-1">{enrolledCount}</h3>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <Users size={26} strokeWidth={2} />
        </div>
      </div>
    </div>

    <!-- Filter & Search Bar -->
    <div class="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="relative w-full sm:w-80">
        <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search size={18} />
        </div>
        <input
          type="text"
          data-testid="course-search-input"
          bind:value={searchQuery}
          placeholder="Cari kursus atau pengajar..."
          class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-sm"
        />
      </div>

      <div class="flex items-center gap-3 w-full sm:w-auto">
        <select
          data-testid="course-filter-select"
          bind:value={filter}
          class="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
        >
          <option value="">Semua Kursus</option>
          <option value="1">Kursus Saya</option>
        </select>
      </div>
    </div>

    <!-- Courses Grid -->
    {#if loadingCourses}
      <div class="flex flex-col items-center justify-center py-20 text-slate-400">
        <LoaderCircle size={36} class="animate-spin text-indigo-600 mb-3" />
        <p class="text-sm font-medium">Memuat data kursus...</p>
      </div>
    {:else if filteredCourses.length === 0}
      <div class="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center">
        <div class="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
          <GraduationCap size={32} />
        </div>
        <h4 class="text-base font-bold text-slate-800">Tidak ada kursus ditemukan</h4>
        <p class="text-sm text-slate-500 max-w-sm mx-auto mt-1">
          {searchQuery
            ? "Coba gunakan kata kunci pencarian yang lain."
            : "Belum ada kursus yang tersedia. Tambahkan kursus baru sekarang!"}
        </p>
      </div>
    {:else}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each filteredCourses as course (course.id)}
          <div
            data-testid={`course-card-${course.id}`}
            class="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
          >
            <!-- Course Cover Image / Gradient Header -->
            <div class="h-44 bg-gradient-to-tr from-indigo-700 to-indigo-900 relative overflow-hidden">
              {#if course.cover}
                <img
                  src={course.cover}
                  alt={course.title}
                  class="w-full h-full object-cover"
                />
              {:else}
                <div class="w-full h-full flex flex-col items-center justify-center text-white/40">
                  <GraduationCap size={48} strokeWidth={1.5} />
                </div>
              {/if}
              <div class="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/70 backdrop-blur-md text-amber-400 text-xs font-bold">
                <Star size={13} class="fill-amber-400" />
                <span>{course.avg_ratings ? Number(course.avg_ratings).toFixed(1) : "0.0"}</span>
              </div>
            </div>

            <!-- Course Content Details -->
            <div class="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 class="text-base font-bold text-slate-900 line-clamp-1 mb-1">
                  {course.title}
                </h3>
                <p class="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                  {course.description}
                </p>
              </div>

              <div class="pt-4 border-t border-slate-100 space-y-3">
                <div class="flex items-center justify-between text-xs text-slate-500">
                  <span class="flex items-center gap-1">
                    <Users size={14} class="text-slate-400" />
                    {course.students ? course.students.length : 0} siswa
                  </span>
                  <span class="flex items-center gap-1">
                    <BookOpen size={14} class="text-slate-400" />
                    {course.total_contents || (course.contents ? course.contents.length : 0)} modul
                  </span>
                </div>

                <div class="flex items-center justify-between gap-2 pt-2">
                  <button
                    type="button"
                    data-testid={`detail-course-btn-${course.id}`}
                    on:click={() => goto(`/courses/${course.id}`)}
                    class="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
                  >
                    <Eye size={14} />
                    <span>Lihat Detail</span>
                  </button>

                  {#if course.user_id === profile.id}
                    <button
                      type="button"
                      data-testid={`edit-course-btn-${course.id}`}
                      on:click={() => handleEditCourse(course.id)}
                      class="p-2 rounded-xl text-amber-600 hover:bg-amber-50 transition-colors"
                      title="Ubah Kursus"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      type="button"
                      data-testid={`delete-course-btn-${course.id}`}
                      on:click={() => handleDeleteCourse(course.id)}
                      class="p-2 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
                      title="Hapus Kursus"
                    >
                      <Trash2 size={15} />
                    </button>
                  {/if}
                </div>
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>

  <AddModal
    show={showAddModal}
    onClose={() => (showAddModal = false)}
    on:close={() => (showAddModal = false)}
  />

  <ChangeModal
    show={showChangeModal}
    courseId={selectedCourseId}
    onClose={() => {
      showChangeModal = false;
      selectedCourseId = null;
    }}
    on:close={() => {
      showChangeModal = false;
      selectedCourseId = null;
    }}
  />
{/if}
