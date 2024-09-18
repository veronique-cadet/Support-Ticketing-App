import React from 'react'
import { useState, useEffect } from "react";


function Form() {

    const [multipleSubmissions, setMultipleSubmissions] = useState(false);

    
    return (
        <div className="max-w-xl mx-auto bg-white p-8 shadow-md rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Form configuration</h2>
    
          {/* Form Title */}
          <div className="mb-4">
            <label htmlFor="formTitle" className="block text-sm font-medium text-gray-700">
              Form title
            </label>
            <input
              type="text"
              id="formTitle"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Example"
            />
          </div>
    
          {/* Form Description */}
          <div className="mb-4">
            <label htmlFor="formDescription" className="block text-sm font-medium text-gray-700">
              Form description - Optional
            </label>
            <input
              type="text"
              id="formDescription"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="hi"
            />
          </div>
    
          {/* Form Visibility */}
          <div className="mb-4">
            <label htmlFor="formVisibility" className="block text-sm font-medium text-gray-700">
              Form visibility
            </label>
            <select
              id="formVisibility"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option>All clients can see the form</option>
              <option>Only specific clients can see the form</option>
            </select>
          </div>
    
          {/* Allow Multiple Submissions */}
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="multipleSubmissions"
              checked={multipleSubmissions}
              onChange={() => setMultipleSubmissions(!multipleSubmissions)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="multipleSubmissions" className="ml-2 text-sm text-gray-700">
              Allow multiple submissions by the same client
            </label>
          </div>
    
          {/* Short Answer Input */}
          <div className="mb-4">
            <label htmlFor="questionTitle" className="block text-sm font-medium text-gray-700">
              Question title
            </label>
            <input
              type="text"
              id="questionTitle"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Name"
            />
          </div>
    
          {/* Question Description */}
          <div className="mb-4">
            <label htmlFor="questionDescription" className="block text-sm font-medium text-gray-700">
              Question description - Optional
            </label>
            <input
              type="text"
              id="questionDescription"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://docs.google.com/spreadsheets/d/INFO..."
            />
          </div>
    
          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Save
            </button>
          </div>
        </div>
      );
}

export default Form