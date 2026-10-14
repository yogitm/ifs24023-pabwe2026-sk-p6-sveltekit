<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { coursesStore } from "../states/coursesStore";
  import {
    ArrowLeft,
    CheckCircle2,
    Circle,
    ChevronLeft,
    ChevronRight,
    LoaderCircle,
  } from "lucide-svelte";
  import type { CourseContent } from "../api/courseApi";

  export let courseId: string | number | null = null;
  export let contentId: string | number | null = null;

  let activeCourseId: string | number | null = null;
  let activeContentId: string | number | null = null;

  $: course = $coursesStore.course;
  $: content = $coursesStore.courseContent;

  $: {
    const cId = courseId || page?.params?.courseId || null;
    const ctId = contentId || page?.params?.contentId || null;
    activeCourseId = cId;
    activeContentId = ctId;
  }

  onMount(() => {
    if (activeCourseId) {
      coursesStore.asyncSetCourse(activeCourseId);
    }
    if (activeContentId) {
      coursesStore.asyncSetCourseContent(activeContentId);
    }
  });

  $: if ($coursesStore.isCourseContentLearn) {
    coursesStore.setIsCourseContentLearn(false);
    if ($coursesStore.isCourseContentLearned && activeContentId) {
      coursesStore.setIsCourseContentLearned(false);
      coursesStore.asyncSetCourseContent(activeContentId);
      if (activeCourseId) {
        coursesStore.asyncSetCourse(activeCourseId);
      }
    }
  }

  function getEmbedUrl(youtube: string): string {
    if (!youtube) return "";
    if (youtube.includes("youtube.com/embed/")) {
      return youtube;
    }
    const match = youtube.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
    return `https://www.youtube.com/embed/${youtube}`;
  }

  function handleToggleLearn() {
    if (!content?.id) return;
    const newStatus = !content.my_status_finished;
    coursesStore.asyncSetIsCourseContentLearn(content.id, newStatus);
  }

  $: contentsList = course?.contents || [];
  $: currentIndex = contentsList.findIndex((c: CourseContent) => String(c.id) === String(activeContentId));
  $: prevContent = currentIndex > 0 ? contentsList[currentIndex - 1] : null;
  $: nextContent = currentIndex >= 0 && currentIndex < contentsList.length - 1 ? contentsList[currentIndex + 1] : null;

  function navigateTo(id: number) {
    if (activeCourseId) {
      goto(`/courses/${activeCourseId}/contents/${id}`);
    }
  }
</script>

<div class="space-y-6 animate-in fade-in duration-300">
  <!-- Top Navigation Bar -->
  <div class="flex items-center justify-between gap-4 flex-wrap">
    <button
      type="button"
      data-testid="back-to-course-btn"
      on:click={() => {
        if (activeCourseId) {
          goto(`/courses/${activeCourseId}`);
        } else {
          goto("/");
        }
      }}
      class="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors"
    >
      <ArrowLeft size={16} />
      <span>Kembali ke Detail Kursus</span>
    </button>

    {#if content}
      <button
        type="button"
        data-testid="toggle-learn-btn"
        on:click={handleToggleLearn}
        class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs {content.my_status_finished ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-600/25'}"
      >
        {#if content.my_status_finished}
          <CheckCircle2 size={16} class="text-emerald-600" />
          <span>Tandai Belum Selesai</span>
        {:else}
          <Circle size={16} />
          <span>Tandai Sudah Selesai</span>
        {/if}
      </button>
    {/if}
  </div>

  {#if !content}
    <div class="flex flex-col items-center justify-center py-24 text-slate-400">
      <LoaderCircle size={36} class="animate-spin text-indigo-600 mb-3" />
      <p class="text-sm font-medium">Memuat video pembelajaran...</p>
    </div>
  {:else}
    <!-- Video Player Container -->
    <div class="bg-black rounded-3xl overflow-hidden shadow-2xl aspect-video w-full relative">
      <iframe
        data-testid="video-iframe"
        src={getEmbedUrl(content.youtube)}
        title={content.title}
        class="w-full h-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
      ></iframe>
    </div>

    <!-- Video Info Header Card -->
    <div class="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span class="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1 block">
            {course?.title || "Materi Pembelajaran"}
          </span>
          <h1 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {content.title}
          </h1>
        </div>

        {#if content.my_status_finished}
          <div class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200/60 self-start sm:self-auto">
            <CheckCircle2 size={15} />
            <span>Selesai Dipelajari</span>
          </div>
        {/if}
      </div>

      <!-- Playlist / Navigation Buttons (Prev / Next) -->
      <div class="pt-6 border-t border-slate-100 flex items-center justify-between gap-4 flex-wrap">
        {#if prevContent}
          <button
            type="button"
            data-testid="prev-content-btn"
            on:click={() => navigateTo(prevContent.id)}
            class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <ChevronLeft size={16} />
            <span>Sebelumnya: {prevContent.title}</span>
          </button>
        {:else}
          <div></div>
        {/if}

        {#if nextContent}
          <button
            type="button"
            data-testid="next-content-btn"
            on:click={() => navigateTo(nextContent.id)}
            class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm ml-auto"
          >
            <span>Selanjutnya: {nextContent.title}</span>
            <ChevronRight size={16} />
          </button>
        {/if}
      </div>
    </div>
  {/if}
</div>
