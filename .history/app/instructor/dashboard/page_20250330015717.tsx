"use client";
import { useState } from "react";

import { Button } from "@/components/ui/button";

export default function InstructorDashboard() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    price: "",
    image: "",
    category: "",
    duration: "",
    language: "",
    level: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCourse((prevCourse) => ({
      ...prevCourse,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      // Make API request or handle course creation logic here
      console.log("New course data", newCourse);
      // Close the modal and reset form
      setShowCreateModal(false);
      setNewCourse({
        title: "",
        description: "",
        price: "",
        image: "",
        category: "",
        duration: "",
        language: "",
        level: "",
      });
    } catch (error) {
      console.error("Error creating course:", error);
    }
  };

  return (
    <div>
      {/* Create New Course Button */}
      <Button onClick={() => setShowCreateModal(true)}>
        Create New Course
      </Button>

      {/* Modal for Creating New Course */}
      {showCreateModal && (
        <Modal onClose={() => setShowCreateModal(false)}>
          <div className="space-y-4 p-6">
            <h2 className="text-xl font-bold">Create New Course</h2>

            {/* Course Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium">
                Title
              </label>
              <input
                id="title"
                name="title"
                value={newCourse.title}
                onChange={handleChange}
                className="w-full p-2 mt-1 border rounded"
                type="text"
              />
            </div>

            {/* Course Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={newCourse.description}
                onChange={handleChange}
                className="w-full p-2 mt-1 border rounded"
                rows={4}
              />
            </div>

            {/* Course Price */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium">
                Price
              </label>
              <input
                id="price"
                name="price"
                value={newCourse.price}
                onChange={handleChange}
                className="w-full p-2 mt-1 border rounded"
                type="number"
                min="0"
              />
            </div>

            {/* Course Image URL */}
            <div>
              <label htmlFor="image" className="block text-sm font-medium">
                Image URL
              </label>
              <input
                id="image"
                name="image"
                value={newCourse.image}
                onChange={handleChange}
                className="w-full p-2 mt-1 border rounded"
                type="text"
              />
            </div>

            {/* Course Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium">
                Category
              </label>
              <input
                id="category"
                name="category"
                value={newCourse.category}
                onChange={handleChange}
                className="w-full p-2 mt-1 border rounded"
                type="text"
              />
            </div>

            {/* Course Duration */}
            <div>
              <label htmlFor="duration" className="block text-sm font-medium">
                Duration
              </label>
              <input
                id="duration"
                name="duration"
                value={newCourse.duration}
                onChange={handleChange}
                className="w-full p-2 mt-1 border rounded"
                type="text"
              />
            </div>

            {/* Course Language */}
            <div>
              <label htmlFor="language" className="block text-sm font-medium">
                Language
              </label>
              <input
                id="language"
                name="language"
                value={newCourse.language}
                onChange={handleChange}
                className="w-full p-2 mt-1 border rounded"
                type="text"
              />
            </div>

            {/* Course Level */}
            <div>
              <label htmlFor="level" className="block text-sm font-medium">
                Level
              </label>
              <input
                id="level"
                name="level"
                value={newCourse.level}
                onChange={handleChange}
                className="w-full p-2 mt-1 border rounded"
                type="text"
              />
            </div>

            {/* Submit Button */}
            <Button onClick={handleSubmit} className="mt-4">
              Create Course
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
