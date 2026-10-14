import { writable } from "svelte/store";
import courseApi, { type Course, type CourseContent } from "../api/courseApi";
import { showErrorDialog, showSuccessDialog } from "../../../helpers/toolsHelper";

export interface CoursesState {
  courses: Course[];
  course: Course | null;
  courseContent: CourseContent | null;
  isCourse: boolean;
  isCourseAdd: boolean;
  isCourseAdded: boolean;
  isCourseChange: boolean;
  isCourseChanged: boolean;
  isCourseChangeCover: boolean;
  isCourseChangedCover: boolean;
  isCourseDelete: boolean;
  isCourseDeleted: boolean;
  isCourseDeleteAll: boolean;
  isCourseDeletedAll: boolean;
  isCourseStudentJoin: boolean;
  isCourseStudentJoined: boolean;
  isCourseStudentLeave: boolean;
  isCourseStudentLeft: boolean;
  isCourseStudentRating: boolean;
  isCourseStudentRated: boolean;
  isCourseContent: boolean;
  isCourseContentAdd: boolean;
  isCourseContentAdded: boolean;
  isCourseContentChange: boolean;
  isCourseContentChanged: boolean;
  isCourseContentDelete: boolean;
  isCourseContentDeleted: boolean;
  isCourseContentLearn: boolean;
  isCourseContentLearned: boolean;
}

function createCoursesStore() {
  const initial: CoursesState = {
    courses: [],
    course: null,
    courseContent: null,
    isCourse: false,
    isCourseAdd: false,
    isCourseAdded: false,
    isCourseChange: false,
    isCourseChanged: false,
    isCourseChangeCover: false,
    isCourseChangedCover: false,
    isCourseDelete: false,
    isCourseDeleted: false,
    isCourseDeleteAll: false,
    isCourseDeletedAll: false,
    isCourseStudentJoin: false,
    isCourseStudentJoined: false,
    isCourseStudentLeave: false,
    isCourseStudentLeft: false,
    isCourseStudentRating: false,
    isCourseStudentRated: false,
    isCourseContent: false,
    isCourseContentAdd: false,
    isCourseContentAdded: false,
    isCourseContentChange: false,
    isCourseContentChanged: false,
    isCourseContentDelete: false,
    isCourseContentDeleted: false,
    isCourseContentLearn: false,
    isCourseContentLearned: false,
  };

  let currentState: CoursesState = { ...initial };
  const innerStore = writable<CoursesState>(currentState);
  innerStore.subscribe((val) => {
    currentState = val;
  });

  return {
    subscribe: innerStore.subscribe,
    get courses() {
      return currentState.courses;
    },
    get course() {
      return currentState.course;
    },
    get courseContent() {
      return currentState.courseContent;
    },
    get isCourse() {
      return currentState.isCourse;
    },
    get isCourseAdd() {
      return currentState.isCourseAdd;
    },
    get isCourseAdded() {
      return currentState.isCourseAdded;
    },
    get isCourseChange() {
      return currentState.isCourseChange;
    },
    get isCourseChanged() {
      return currentState.isCourseChanged;
    },
    get isCourseChangeCover() {
      return currentState.isCourseChangeCover;
    },
    get isCourseChangedCover() {
      return currentState.isCourseChangedCover;
    },
    get isCourseDelete() {
      return currentState.isCourseDelete;
    },
    get isCourseDeleted() {
      return currentState.isCourseDeleted;
    },
    get isCourseDeleteAll() {
      return currentState.isCourseDeleteAll;
    },
    get isCourseDeletedAll() {
      return currentState.isCourseDeletedAll;
    },
    get isCourseStudentJoin() {
      return currentState.isCourseStudentJoin;
    },
    get isCourseStudentJoined() {
      return currentState.isCourseStudentJoined;
    },
    get isCourseStudentLeave() {
      return currentState.isCourseStudentLeave;
    },
    get isCourseStudentLeft() {
      return currentState.isCourseStudentLeft;
    },
    get isCourseStudentRating() {
      return currentState.isCourseStudentRating;
    },
    get isCourseStudentRated() {
      return currentState.isCourseStudentRated;
    },
    get isCourseContent() {
      return currentState.isCourseContent;
    },
    get isCourseContentAdd() {
      return currentState.isCourseContentAdd;
    },
    get isCourseContentAdded() {
      return currentState.isCourseContentAdded;
    },
    get isCourseContentChange() {
      return currentState.isCourseContentChange;
    },
    get isCourseContentChanged() {
      return currentState.isCourseContentChanged;
    },
    get isCourseContentDelete() {
      return currentState.isCourseContentDelete;
    },
    get isCourseContentDeleted() {
      return currentState.isCourseContentDeleted;
    },
    get isCourseContentLearn() {
      return currentState.isCourseContentLearn;
    },
    get isCourseContentLearned() {
      return currentState.isCourseContentLearned;
    },
    get $state() {
      return currentState;
    },
    reset(state: Partial<CoursesState> = initial) {
      innerStore.set({ ...initial, ...state });
    },
    setCourses(courses: Course[]) {
      innerStore.update((s) => ({ ...s, courses }));
    },
    setCourse(course: Course | null) {
      innerStore.update((s) => ({ ...s, course }));
    },
    setCourseContent(courseContent: CourseContent | null) {
      innerStore.update((s) => ({ ...s, courseContent }));
    },
    setIsCourse(status: boolean) {
      innerStore.update((s) => ({ ...s, isCourse: status }));
    },
    setIsCourseAdd(status: boolean) {
      innerStore.update((s) => ({ ...s, isCourseAdd: status }));
    },
    setIsCourseAdded(status: boolean) {
      innerStore.update((s) => ({ ...s, isCourseAdded: status }));
    },
    setIsCourseChange(status: boolean) {
      innerStore.update((s) => ({ ...s, isCourseChange: status }));
    },
    setIsCourseChanged(status: boolean) {
      innerStore.update((s) => ({ ...s, isCourseChanged: status }));
    },
    setIsCourseChangeCover(status: boolean) {
      innerStore.update((s) => ({ ...s, isCourseChangeCover: status }));
    },
    setIsCourseChangedCover(status: boolean) {
      innerStore.update((s) => ({ ...s, isCourseChangedCover: status }));
    },
    setIsCourseDelete(status: boolean) {
      innerStore.update((s) => ({ ...s, isCourseDelete: status }));
    },
    setIsCourseDeleted(status: boolean) {
      innerStore.update((s) => ({ ...s, isCourseDeleted: status }));
    },
    setIsCourseDeleteAll(status: boolean) {
      innerStore.update((s) => ({ ...s, isCourseDeleteAll: status }));
    },
    setIsCourseDeletedAll(status: boolean) {
      innerStore.update((s) => ({ ...s, isCourseDeletedAll: status }));
    },
    setIsCourseStudentJoin(status: boolean) {
      innerStore.update((s) => ({ ...s, isCourseStudentJoin: status }));
    },
    setIsCourseStudentJoined(status: boolean) {
      innerStore.update((s) => ({ ...s, isCourseStudentJoined: status }));
    },
    setIsCourseStudentLeave(status: boolean) {
      innerStore.update((s) => ({ ...s, isCourseStudentLeave: status }));
    },
    setIsCourseStudentLeft(status: boolean) {
      innerStore.update((s) => ({ ...s, isCourseStudentLeft: status }));
    },
    setIsCourseStudentRating(status: boolean) {
      innerStore.update((s) => ({ ...s, isCourseStudentRating: status }));
    },
    setIsCourseStudentRated(status: boolean) {
      innerStore.update((s) => ({ ...s, isCourseStudentRated: status }));
    },
    setIsCourseContent(status: boolean) {
      innerStore.update((s) => ({ ...s, isCourseContent: status }));
    },
    setIsCourseContentAdd(status: boolean) {
      innerStore.update((s) => ({ ...s, isCourseContentAdd: status }));
    },
    setIsCourseContentAdded(status: boolean) {
      innerStore.update((s) => ({ ...s, isCourseContentAdded: status }));
    },
    setIsCourseContentChange(status: boolean) {
      innerStore.update((s) => ({ ...s, isCourseContentChange: status }));
    },
    setIsCourseContentChanged(status: boolean) {
      innerStore.update((s) => ({ ...s, isCourseContentChanged: status }));
    },
    setIsCourseContentDelete(status: boolean) {
      innerStore.update((s) => ({ ...s, isCourseContentDelete: status }));
    },
    setIsCourseContentDeleted(status: boolean) {
      innerStore.update((s) => ({ ...s, isCourseContentDeleted: status }));
    },
    setIsCourseContentLearn(status: boolean) {
      innerStore.update((s) => ({ ...s, isCourseContentLearn: status }));
    },
    setIsCourseContentLearned(status: boolean) {
      innerStore.update((s) => ({ ...s, isCourseContentLearned: status }));
    },

    async asyncSetCourses(is_me: string | number | boolean = "") {
      try {
        const courses = await courseApi.getCourses(is_me);
        this.setCourses(courses);
      } catch {
        this.setCourses([]);
      }
    },

    async asyncSetCourse(courseId: string | number) {
      try {
        const course = await courseApi.getCourseById(courseId);
        this.setCourse(course);
      } catch {
        this.setCourse(null);
      } finally {
        this.setIsCourse(true);
      }
    },

    async asyncSetIsCourseAdd(title: string, description: string) {
      try {
        await courseApi.postCourse(title, description);
        showSuccessDialog("Kursus berhasil ditambahkan!");
        this.setIsCourseAdded(true);
      } catch (error: any) {
        showErrorDialog(error.message);
        this.setIsCourseAdded(false);
      } finally {
        this.setIsCourseAdd(true);
      }
    },

    async asyncSetIsCourseChange(
      courseId: string | number,
      title: string,
      description: string
    ) {
      try {
        const message = await courseApi.putCourse(courseId, title, description);
        showSuccessDialog(message || "Kursus berhasil diubah!");
        this.setIsCourseChanged(true);
      } catch (error: any) {
        showErrorDialog(error.message);
        this.setIsCourseChanged(false);
      } finally {
        this.setIsCourseChange(true);
      }
    },

    async asyncSetIsCourseChangeCover(courseId: string | number, cover: File) {
      try {
        const message = await courseApi.postCourseCover(courseId, cover);
        showSuccessDialog(message || "Cover kursus berhasil diubah!");
        this.setIsCourseChangedCover(true);
      } catch (error: any) {
        showErrorDialog(error.message);
        this.setIsCourseChangedCover(false);
      } finally {
        this.setIsCourseChangeCover(true);
      }
    },

    async asyncSetIsCourseDelete(courseId: string | number) {
      try {
        const message = await courseApi.deleteCourse(courseId);
        showSuccessDialog(message || "Kursus berhasil dihapus!");
        this.setIsCourseDeleted(true);
      } catch (error: any) {
        showErrorDialog(error.message);
        this.setIsCourseDeleted(false);
      } finally {
        this.setIsCourseDelete(true);
      }
    },

    async asyncSetIsCourseDeleteAll() {
      try {
        const message = await courseApi.deleteAllCourses();
        showSuccessDialog(message || "Semua kursus berhasil dihapus!");
        this.setIsCourseDeletedAll(true);
      } catch (error: any) {
        showErrorDialog(error.message);
        this.setIsCourseDeletedAll(false);
      } finally {
        this.setIsCourseDeleteAll(true);
      }
    },

    async asyncSetIsCourseStudentJoin(courseId: string | number) {
      try {
        const message = await courseApi.postCourseStudent(courseId);
        showSuccessDialog(message || "Berhasil bergabung ke kursus!");
        this.setIsCourseStudentJoined(true);
      } catch (error: any) {
        showErrorDialog(error.message);
        this.setIsCourseStudentJoined(false);
      } finally {
        this.setIsCourseStudentJoin(true);
      }
    },

    async asyncSetIsCourseStudentLeave(courseId: string | number) {
      try {
        const message = await courseApi.deleteCourseStudent(courseId);
        showSuccessDialog(message || "Berhasil keluar dari kursus!");
        this.setIsCourseStudentLeft(true);
      } catch (error: any) {
        showErrorDialog(error.message);
        this.setIsCourseStudentLeft(false);
      } finally {
        this.setIsCourseStudentLeave(true);
      }
    },

    async asyncSetIsCourseStudentRating(
      courseId: string | number,
      ratings: number,
      comment: string = ""
    ) {
      try {
        const message = await courseApi.putCourseStudentRating(
          courseId,
          ratings,
          comment
        );
        showSuccessDialog(message || "Berhasil memberikan rating!");
        this.setIsCourseStudentRated(true);
      } catch (error: any) {
        showErrorDialog(error.message);
        this.setIsCourseStudentRated(false);
      } finally {
        this.setIsCourseStudentRating(true);
      }
    },

    async asyncSetCourseContent(contentId: string | number) {
      try {
        const content = await courseApi.getCourseContentById(contentId);
        this.setCourseContent(content);
      } catch {
        this.setCourseContent(null);
      } finally {
        this.setIsCourseContent(true);
      }
    },

    async asyncSetIsCourseContentAdd(
      courseId: string | number,
      title: string,
      youtube: string
    ) {
      try {
        await courseApi.postCourseContent(courseId, title, youtube);
        showSuccessDialog("Konten kursus berhasil ditambahkan!");
        this.setIsCourseContentAdded(true);
      } catch (error: any) {
        showErrorDialog(error.message);
        this.setIsCourseContentAdded(false);
      } finally {
        this.setIsCourseContentAdd(true);
      }
    },

    async asyncSetIsCourseContentChange(
      contentId: string | number,
      title: string,
      youtube: string
    ) {
      try {
        const message = await courseApi.putCourseContent(
          contentId,
          title,
          youtube
        );
        showSuccessDialog(message || "Konten kursus berhasil diubah!");
        this.setIsCourseContentChanged(true);
      } catch (error: any) {
        showErrorDialog(error.message);
        this.setIsCourseContentChanged(false);
      } finally {
        this.setIsCourseContentChange(true);
      }
    },

    async asyncSetIsCourseContentDelete(contentId: string | number) {
      try {
        const message = await courseApi.deleteCourseContent(contentId);
        showSuccessDialog(message || "Konten kursus berhasil dihapus!");
        this.setIsCourseContentDeleted(true);
      } catch (error: any) {
        showErrorDialog(error.message);
        this.setIsCourseContentDeleted(false);
      } finally {
        this.setIsCourseContentDelete(true);
      }
    },

    async asyncSetIsCourseContentLearn(
      contentId: string | number,
      status: number | boolean
    ) {
      try {
        const message = await courseApi.postCourseContentLearn(
          contentId,
          status
        );
        showSuccessDialog(message || "Status pembelajaran berhasil diperbarui!");
        this.setIsCourseContentLearned(true);
      } catch (error: any) {
        showErrorDialog(error.message);
        this.setIsCourseContentLearned(false);
      } finally {
        this.setIsCourseContentLearn(true);
      }
    },
  };
}

export const coursesStore = createCoursesStore();
export const useCoursesStore = () => coursesStore;
export default coursesStore;
