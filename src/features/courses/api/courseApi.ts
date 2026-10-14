import apiHelper from "../../../helpers/apiHelper";

declare const DELCOM_BASEURL: string;

export interface CourseAuthor {
  name: string;
  photo?: string | null;
}

export interface CourseRating {
  name: string;
  ratings: number;
  comment?: string;
}

export interface CourseContent {
  id: number;
  course_id?: number;
  title: string;
  youtube: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
  my_status_finished?: boolean;
}

export interface Course {
  id: number;
  user_id: number;
  title: string;
  description: string;
  cover?: string | null;
  created_at?: string;
  updated_at?: string;
  author?: CourseAuthor;
  students?: number[];
  contents?: CourseContent[];
  total_contents?: number;
  ratings?: CourseRating[];
  avg_ratings?: string | number | null;
  my_percentage_finished?: string | number;
}

const courseApi = (() => {
  const BASE_URL = `${DELCOM_BASEURL}/courses`;

  function _url(path: string): string {
    return BASE_URL + path;
  }

  async function postCourse(title: string, description: string): Promise<any> {
    const response = await apiHelper.fetchData(_url("/"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
      }),
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal menambahkan kursus");
    }

    return result.data;
  }

  async function postCourseCover(courseId: string | number, cover: File): Promise<string> {
    const formData = new FormData();
    formData.append("cover", cover, cover.name || "cover.jpg");
    const response = await apiHelper.fetchData(_url(`/${courseId}/cover`), {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal mengubah cover");
    }

    return result.message;
  }

  async function putCourse(
    courseId: string | number,
    title: string,
    description: string
  ): Promise<string> {
    const response = await apiHelper.fetchData(_url(`/${courseId}`), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
      }),
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal mengubah kursus");
    }

    return result.message;
  }

  async function getCourses(is_me: string | number | boolean = ""): Promise<Course[]> {
    const targetUrl =
      is_me !== "" && is_me !== null && is_me !== undefined && is_me !== false && is_me !== 0
        ? `/?is_me=1`
        : "/";

    const response = await apiHelper.fetchData(_url(targetUrl), {
      method: "GET",
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal mengambil data kursus");
    }

    return result.data?.courses || [];
  }

  async function getCourseById(courseId: string | number): Promise<Course> {
    const response = await apiHelper.fetchData(_url(`/${courseId}`), {
      method: "GET",
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal mengambil detail kursus");
    }

    return result.data?.course;
  }

  async function deleteCourse(courseId: string | number): Promise<string> {
    const response = await apiHelper.fetchData(_url(`/${courseId}`), {
      method: "DELETE",
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal menghapus kursus");
    }

    return result.message;
  }

  async function deleteAllCourses(): Promise<string> {
    const response = await apiHelper.fetchData(_url("/"), {
      method: "DELETE",
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal menghapus semua kursus");
    }

    return result.message;
  }

  async function postCourseStudent(courseId: string | number): Promise<string> {
    const response = await apiHelper.fetchData(_url(`/${courseId}/students`), {
      method: "POST",
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal bergabung ke kursus");
    }

    return result.message;
  }

  async function deleteCourseStudent(courseId: string | number): Promise<string> {
    const response = await apiHelper.fetchData(_url(`/${courseId}/students`), {
      method: "DELETE",
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal keluar dari kursus");
    }

    return result.message;
  }

  async function putCourseStudentRating(
    courseId: string | number,
    ratings: number,
    comment: string = ""
  ): Promise<string> {
    const response = await apiHelper.fetchData(_url(`/${courseId}/students/ratings`), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ratings,
        comment,
      }),
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal mengubah rating kursus");
    }

    return result.message;
  }

  async function postCourseContent(
    courseId: string | number,
    title: string,
    youtube: string
  ): Promise<any> {
    const response = await apiHelper.fetchData(_url(`/${courseId}/contents`), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        youtube,
      }),
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal menambahkan konten kursus");
    }

    return result.data;
  }

  async function putCourseContent(
    contentId: string | number,
    title: string,
    youtube: string
  ): Promise<string> {
    const response = await apiHelper.fetchData(_url(`/-/contents/${contentId}`), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        youtube,
      }),
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal mengubah konten kursus");
    }

    return result.message;
  }

  async function getCourseContentById(contentId: string | number): Promise<CourseContent> {
    const response = await apiHelper.fetchData(_url(`/-/contents/${contentId}`), {
      method: "GET",
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal mengambil detail konten kursus");
    }

    return result.data?.course_content;
  }

  async function deleteCourseContent(contentId: string | number): Promise<string> {
    const response = await apiHelper.fetchData(_url(`/-/contents/${contentId}`), {
      method: "DELETE",
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal menghapus konten kursus");
    }

    return result.message;
  }

  async function postCourseContentLearn(
    contentId: string | number,
    status: number | boolean
  ): Promise<string> {
    const response = await apiHelper.fetchData(_url(`/-/contents/${contentId}/learns`), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: status ? 1 : 0,
      }),
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal mengubah status belajar");
    }

    return result.message;
  }

  return {
    postCourse,
    postCourseCover,
    putCourse,
    getCourses,
    getCourseById,
    deleteCourse,
    deleteAllCourses,
    postCourseStudent,
    deleteCourseStudent,
    putCourseStudentRating,
    postCourseContent,
    putCourseContent,
    getCourseContentById,
    deleteCourseContent,
    postCourseContentLearn,
  };
})();

export default courseApi;
