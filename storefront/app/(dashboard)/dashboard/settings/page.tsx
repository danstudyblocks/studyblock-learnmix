function SettingsPage() {
  return (
    <>
      <section className="mt-[100px] pt-15">
        <div className="4xl:large-container grid grid-cols-12 gap-4 rounded-2xl bg-white p-4 max-4xl:mx-4 sm:gap-6 sm:p-10">
          <div className="col-span-12 flex items-center justify-between gap-4">
            <h4 className="heading-4">Account Settings</h4>
          </div>

          <div className="col-span-12 border-b border-n30 py-6">
            <h5 className="heading-5">Update password</h5>
          </div>
          <div className="col-span-12">
            <p className="pb-3 font-medium text-n100">Current Password*</p>
            <input
              type="password"
              placeholder="Enter Old Password"
              className="w-full rounded-xl border border-b50 bg-n10 p-3 outline-none placeholder:text-n800"
            />
          </div>
          <div className="col-span-12">
            <p className="pb-3 font-medium text-n100">Enter Password*</p>
            <input
              type="password"
              placeholder="Enter New Password"
              className="w-full rounded-xl border border-b50 bg-n10 p-3 outline-none placeholder:text-n800"
            />
          </div>
          <div className="col-span-12">
            <p className="pb-3 font-medium text-n100">Enter New Password*</p>
            <input
              type="password"
              placeholder="Confirm New Password"
              className="w-full rounded-xl border border-b50 bg-n10 p-3 outline-none placeholder:text-n800"
            />
          </div>
          <div className="col-span-12">
            <button className="relative flex w-full items-center justify-center overflow-hidden rounded-xl bg-b300 px-4 py-3 font-semibold text-white duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-xl after:bg-yellow-400 after:duration-700 hover:text-n900 hover:after:w-[calc(100%+2px)] sm:px-8">
              <span className="relative z-10">Save Changes</span>
            </button>
          </div>
        </div>
      </section>

      <section>
        <div className="4xl:large-container mt-6 grid grid-cols-12 gap-4 rounded-2xl bg-white p-4 max-4xl:mx-4 sm:gap-6 sm:p-10">
          <div className="col-span-12 border-b border-n30 py-6">
            <h5 className="heading-5">Deactivate Account</h5>
          </div>
          <div className="col-span-12">
            <p className="pb-3 font-medium text-n100">Choose Reason*</p>
            <input
              type="text"
              placeholder="Choose Reason"
              className="w-full rounded-xl border border-b50 bg-n10 p-3 outline-none placeholder:text-n800"
            />
          </div>
          <div className="col-span-12">
            <p className="pb-3 font-medium text-n100">Add Description*</p>
            <input
              type="text"
              placeholder="Add Description"
              className="w-full rounded-xl border border-b50 bg-n10 p-3 outline-none placeholder:text-n800"
            />
          </div>

          <div className="col-span-12">
            <button className="relative flex w-full items-center justify-center overflow-hidden rounded-xl bg-r300 px-4 py-3 font-semibold text-white duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-xl after:bg-yellow-400 after:duration-700 hover:text-n900 hover:after:w-[calc(100%+2px)] sm:px-8">
              <span className="relative z-10">Deactivate Now</span>
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

export default SettingsPage;
