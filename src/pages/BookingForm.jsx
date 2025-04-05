import React from "react";

const BookingForm = () => {
  return (
    <div className="flex flex-col min-h-screen justify-center gap-9 bg-white px-9">
      <div className="flex justify-center items-center flex-col gap-3">
        <h2 className="text-2xl font-bold">Basic Input</h2>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Type here"
            className="input input-bordered input-primary w-full max-w-xs"
          />
          <input
            type="text"
            placeholder="Type here"
            className="input input-bordered input-warning w-full max-w-xs"
          />
        </div>
      </div>

      <div className="flex items-center flex-col gap-3">
        <h2 className="text-2xl font-bold">File Input</h2>
        <input
          type="file"
          className="file-input file-input-bordered file-input-primary w-full max-w-xs"
        />
      </div>
      {/* Button with loading spinner and text */}
      <div className="flex items-center flex-col gap-3">
        <h2 className="text-2xl font-bold">Select</h2>
        <select className="select select-primary w-full max-w-xs">
          <option disabled selected>
            What is the best TV show?
          </option>
          <option>Game of Thrones</option>
          <option>Lost</option>
          <option>Breaking Bad</option>
          <option>Walking Dead</option>
        </select>
      </div>
      {/* Outline Button */}
      <div className="flex justify-center items-center flex-col gap-3">
        <h2 className="text-2xl font-bold">Checkbox</h2>
        <div className="flex gap-2">
          <div className="form-control">
            <label className="label cursor-pointer">
              <input
                type="checkbox"
                className="checkbox checkbox-primary mr-1"
              />
              <span className="label-text">React Js</span>
            </label>
          </div>
          <div className="form-control">
            <label className="cursor-pointer label">
              <input
                type="checkbox"
                className="checkbox checkbox-secondary mr-1"
              />
              <span className="label-text">Next Js</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
