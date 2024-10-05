type CVUploadFormProps = {
  userDBId: string;
};

export function CVUploadForm({ userDBId }: CVUploadFormProps) {
  return (
    <form
      className="flex flex-col gap-4"
      method="post"
      encType="multipart/form-data"
    >
      <input type="hidden" name="userDBId" value={userDBId} />
      <input type="file" name="file" required />
      <div className="flex flex-col space-y-2">
        <input
          type="text"
          id="textInput"
          name="textInput"
          placeholder="Give your CV a name, e.g., 'original CV'"
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        type="submit"
        className="btn mt-4 p-2 bg-blue-500 text-white rounded"
      >
        Upload File
      </button>
    </form>
  );
}
