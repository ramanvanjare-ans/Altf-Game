import React from 'react';



const ExtractionResults = ({ data }) => {
    


    const InfoRow = ({ icon: Icon, label, value, isArray }) => (
        <div
      className={`
        p-4 sm:p-5 rounded-xl border bg-(--card) text-(-foreground)
        
        transition-shadow 
        mb-${isArray ? "3 md:mb-4" : "2 md:mb-3"}
      `}
    >
      {/* Label + Icon */}
      <div className="flex items-center mb-2">
        
        <p className="uppercase tracking-widest text-(--foreground)  font-bold text-xs sm:text-sm">
          {label}
        </p>
      </div>

      {/* Value */}
      {isArray && Array.isArray(value) ? (
        <div className="flex flex-wrap gap-2 mt-3">
          {value.length > 0 ? (
            value.map((item, index) => (
              <span
                key={index}
                className="px-4 py-2 rounded-full  text-(--foreground) text-sm font-semibold"
              >
                {item}
              </span>
            ))
          ) : (
            <p className="italic text-(--foreground) text-sm">
              No skills extracted.
            </p>
          )}
        </div>
      ) : (
        <p className="text-(--foreground) font-bold text-base sm:text-lg">
          {value || "N/A"}
        </p>
      )}
    </div>
    );


    const DetailSection = ({ title, icon: Icon, items }) => (
<div className="mb-6 p-6 w-full rounded-2xl bg-(--background)  shadow-sm">
      
      {/* Header */}
      <div className="flex items-center text-(--foreground) mb-5">
        {/* <Icon className="mr-3 text-purple-500 w-6 h-6" /> */}
        <h3 className="subheading">
          {title}
        </h3>
      </div>

      {/* Content */}
      {Array.isArray(items) && items.length > 0 ? (
        <ul className="pl-6 list-disc space-y-2">
          {items.map((item, index) => (
            <li
              key={index}
              className="content"
            >
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="ml-6 italic text-gray-400">
          No details found for this section.
        </p>
      )}
    </div>
    );

    return (
        <div
      className="
        w-full rounded-2xl bg-(--background)
        p-4 sm:p-6 md:p-10
        shadow-[0_6px_20px_rgba(0,0,0,0.15)]
        md:shadow-[0_15px_40px_rgba(0,0,0,0.2)]
      "
    >
      {/* Header */}
      <div className="mb-10">
        <h1 className="subheading">
           Document Extraction Summary
        </h1>
        <p className=" description  ">
          Detailed overview of the key data points extracted from the source document.
        </p>
      </div>

      <hr className="border-dashed mb-10" />

      {/* Job Overview */}
      <h2 className="subheading mb-5">Job & Logistics Overview</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
        <InfoRow label="Role Title"  value={data.roleTitle} />
        <InfoRow label="Seniority Level" value={data.seniority}  />
        <InfoRow label="Employment Type" value={data.employmentType} />
        <InfoRow label="Location" value={data.location} />
        <InfoRow label="Experience Required" value={data.experienceYears} />
      </div>

      <hr className="my-10" />

      {/* Skills */}
      <h2 className="subheading mb-6">Technical Requirements</h2>
      <InfoRow label="Required Skills / Technologies" value={data.skills} isArray />

      <hr className="my-10" />

      {/* Responsibilities & Qualifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 ">
        <DetailSection
        className="subheading"
          title="Key Responsibilities"
          items={data.responsibilities}
        />
        <DetailSection
          title="Required Qualifications"
          items={data.qualifications}
        />
      </div>
    </div>
    );
};

export default ExtractionResults;