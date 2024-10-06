export const FAQ = () => {
  return (
    <div className="flex flex gap-16 bg-indigo-100 py-16 px-32">
      <h2 className="text-5xl not-italic font-normal">FAQ</h2>
      <div className="w-full  flex flex-col gap-4">
        <div className="collapse collapse-plus bg-indigo-50">
          <input type="radio" name="my-accordion-3" defaultChecked />
          <div className="collapse-title text-xl font-medium">
            How does the AI customize my resume?
          </div>
          <div className="collapse-content">
            <p>
              Our AI analyzes both your uploaded resume and the job description
              to create a tailored CV that fits the specific requirements of
              your target job.
            </p>
          </div>
        </div>
        <div className="collapse collapse-plus bg-indigo-50">
          <input type="radio" name="my-accordion-3" />
          <div className="collapse-title text-xl font-medium">
            How fast can I get my enhanced resume?
          </div>
          <div className="collapse-content">
            <p>hello</p>
          </div>
        </div>
        <div className="collapse collapse-plus bg-indigo-50">
          <input type="radio" name="my-accordion-3" />
          <div className="collapse-title text-xl font-medium">
            Can I still make manual changes to my resume?
          </div>
          <div className="collapse-content">
            <p>hello</p>
          </div>
        </div>
        <div className="collapse collapse-plus bg-indigo-50">
          <input type="radio" name="my-accordion-3" />
          <div className="collapse-title text-xl font-medium">
            Is this service suitable for all industries?
          </div>
          <div className="collapse-content">
            <p>hello</p>
          </div>
        </div>
        <div className="collapse collapse-plus bg-indigo-50">
          <input type="radio" name="my-accordion-3" />
          <div className="collapse-title text-xl font-medium">
            How much does it cost to use AI Resume Enhancer?
          </div>
          <div className="collapse-content">
            <p>hello</p>
          </div>
        </div>
      </div>
    </div>
  );
};
//#CBD5E1
