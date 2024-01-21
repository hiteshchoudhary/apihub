import { HttpResponse, http } from "msw";

// Mock Data
export const todos = [
  {
    _id: "65ad0a17fde2eb089b1fdcc3",
    title: "Vitae veritatis quod.",
    description:
      "Blanditiis dicta rerum delectus harum esse. Quasi voluptates tempore accusamus quae architecto dolor nisi velit molestias. Incidunt praesentium nam inventore blanditiis nam. Magni quae harum. Doloremque adipisci ducimus. Tempore suscipit fuga provident possimus cum velit dolorem autem. Rem odio cumque nesciunt. Tempora dicta sint modi soluta voluptates consectetur eos tempora enim. Nesciunt veniam iusto aliquid maiores at repellat dolor est. Distinctio ullam occaecati consequuntur incidunt assumenda.",
    isComplete: false,
    __v: 0,
    createdAt: "2024-01-21T12:12:07.392Z",
    updatedAt: "2024-01-21T12:12:07.392Z",
  },
  {
    _id: "65ad0a17fde2eb089b1fdcc4",
    title: "Culpa praesentium blanditiis.",
    description:
      "Occaecati eius voluptatem corporis quasi incidunt. Dolores dolorum eum molestias culpa tempore. Asperiores eos nostrum doloremque blanditiis sed doloribus ipsam totam perferendis. Laborum accusamus incidunt enim quisquam ea quis modi beatae. Similique in voluptate neque aliquam deleniti laborum. Ex cum ab doloribus quasi quas. Possimus consequatur quae. Inventore quibusdam saepe officiis repellendus blanditiis odio. Possimus fugiat quidem perferendis tempore at soluta unde voluptate. Dicta non ipsam dolores quo. Numquam alias soluta placeat minima occaecati pariatur. Vitae quidem consequuntur pariatur voluptatibus laboriosam in fuga ut. Corrupti dolores perspiciatis animi alias odio. Eos nulla consequatur eaque consectetur fuga beatae at.",
    isComplete: true,
    __v: 0,
    createdAt: "2024-01-21T12:12:07.392Z",
    updatedAt: "2024-01-21T12:12:07.392Z",
  },
  {
    _id: "65ad0a17fde2eb089b1fdcc5",
    title: "Quos quisquam totam.",
    description:
      "Corporis officia eius. Assumenda accusamus corrupti tenetur quam. Alias cupiditate perferendis molestias possimus. Consequuntur odit architecto repellendus aliquid doloremque dicta. Provident illo culpa provident explicabo. Totam numquam dolor reiciendis. Ipsum asperiores iste saepe. Hic minus blanditiis animi exercitationem voluptatibus quaerat. A architecto similique in officiis aspernatur deserunt quibusdam quae eum. Eum explicabo eius ipsum fugiat voluptatem. Est fuga distinctio. Repellendus deserunt nam fugit sit exercitationem assumenda sunt. Dolores architecto at. Harum deleniti quod iste. Quo facere ea quam consequatur.",
    isComplete: false,
    __v: 0,
    createdAt: "2024-01-21T12:12:07.392Z",
    updatedAt: "2024-01-21T12:12:07.392Z",
  },
];

export const handlers = [
  http.get(`${import.meta.env.VITE_SERVER_URL}/todos`, () => {
    return HttpResponse.json(todos, { status: 200 });
  }),
];
