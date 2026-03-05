import { ArrowUpIcon } from 'lucide-react';
import React from 'react';


const SuggestionsPanel = ({ suggestions }) => {
    

    const SuggestionBlock = ({ title, icon: Icon, color, children }) => (
<div
  className="
    mb-4 p-6 rounded-lg
    bg-(--card)
    border border-(--border)
    text-(--foreground)
  "
>
  {/* Header with Icon and Title */}
  <div className="flex items-center mb-2 pb-2 border-b border-gray-200">
    {/* <Icon className="mr-3 text-blue-600 text-xl" /> */}
    <h3 className="text-lg font-bold text-gray-900">
      {title}
    </h3>
  </div>

  {children}
</div>

    );

    return (
       <div
  className="
    p-8 rounded-2xl
  
    shadow-[0_10px_25px_rgba(2,132,199,0.1)]
  "
>
  {/* Title */}
  {/* <h2 className="subheading ">
     AI Recommendations
  </h2> */}

  {/* <p className="description mb-6">
    Enhance your content using these data-driven suggestions.
  </p> */}

  {/* <hr className="mb-8 border-gray-200" /> */}

  {/* --- Alternative Job Titles --- */}
  {/* <SuggestionBlock
    title="Alternative Job Titles"
    // icon={TitleIcon}
    className="text-(--foreground)"
  >
    <p className="text-sm text-(--foreground) mb-3">
      Consider these high-traffic titles to improve search visibility:
    </p>

    <div className="flex flex-wrap gap-3">
      {suggestions.alternativeTitles.map((title, index) => (
        <span
          key={index}
          className="
            px-3 py-1
            text-sm font-semibold
            rounded-full
            bg-blue-600 text-white
            cursor-pointer
            hover:bg-blue-700
          "
        >
          {title}
        </span>
      ))}
    </div>
  </SuggestionBlock> */}

  {/* --- Recommended Salary Band --- */}
  {/* {suggestions.salaryBand && (
    <SuggestionBlock
      title="Recommended Compensation"
    //   icon={MoneyIcon}
      color="success"
    >
      <h3 className="text-2xl font-bold text-green-700 mb-1">
        {suggestions.salaryBand}
      </h3>

      <p className="text-sm text-gray-500">
        This band is based on current market rates and regional data for similar
        seniority levels.
      </p>
    </SuggestionBlock>
  )} */}

  {/* --- Job Board Tags --- */}
  {/* <SuggestionBlock
    title="Job Board Tags"
    // icon={LabelIcon}
    color="secondary"
  >
    <p className="text-sm text-gray-500 mb-3">
      Use these tags to better categorize your post on major job platforms:
    </p>

    <div className="flex flex-wrap gap-3">
      {suggestions.jobBoardTags.map((tag, index) => (
        <span
          key={index}
          className="
            px-3 py-1
            text-sm font-medium
            rounded-full
            border border-purple-400
            text-purple-700
          "
        >
          {tag}
        </span>
      ))}
    </div>
  </SuggestionBlock> */}

  {/* --- Improvement Tips --- */}
  {/* <SuggestionBlock
    title="Content Improvement Tips"
    // icon={LightbulbIcon}
    color="warning"
  > */}
    {/* <ul className="space-y-3">
      {suggestions.improvementTips.map((tip, index) => (
        <li
          key={index}
          className="
            flex items-start gap-2
            pb-2
            border-b border-dashed border-gray-300
          "
        >
          <ArrowUpIcon className="text-yellow-500 mt-1 text-lg" />
          <p className="text-gray-800">
            {tip}
          </p>
        </li>
      ))}
    </ul>
  </SuggestionBlock> */}
</div>

    );
};

export default SuggestionsPanel;