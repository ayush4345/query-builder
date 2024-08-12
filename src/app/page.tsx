"use client"

import { ChartIcon } from "@/assets/chart.svg";
import { SettingIcon } from "@/assets/setting.svg";
import QueryBuilderModal from "@/components/QueryBuilderModal";
import { QueryBuilder } from "@/lib/QueryBuilder";
import { useState } from "react";

export default function Home() {

  const [openModal, setOpenModal] = useState<boolean>(false)
  const [queryBuilder] = useState(new QueryBuilder());

  return (
    <main className="flex flex-col min-h-screen">
      <nav className="bg-[#292C33] py-4 px-8 flex gap-6 items-center">
        <span className="w-8 h-8"><img src='/logo.png' /></span>
        <span className=" text-[#8B8C8C] cursor-pointer hover:text-white hover:bg-[#404348] hover:rounded-full p-2 px-4 flex gap-2 group">
          <ChartIcon className="fill-[#8B8C8C] group-hover:fill-white" /><p>Themetic Analysis</p>
        </span>
        <span className=" text-[#8B8C8C] cursor-pointer hover:text-white hover:bg-[#404348] hover:rounded-full p-2 px-4 flex gap-2 group">
          <ChartIcon className="fill-[#8B8C8C] group-hover:fill-white" /><p>Nascent Themes</p>
        </span>
        <span className=" text-[#8B8C8C] cursor-pointer hover:text-white hover:bg-[#404348] hover:rounded-full p-2 px-4 flex gap-2 group">
          <SettingIcon className="fill-[#8B8C8C] group-hover:fill-white" /><p>Settings</p>
        </span>
      </nav>
      <section className="flex p-6">
        <aside className="flex flex-col gap-4 w-full max-w-[322px] py-[70px] px-4">
          <div className=" font-semibold text-base flex gap-2"><img src='/filter.svg' /><p>Build your query</p></div>
          <div className=" stroke-black stroke-[4px] text-white/40 text-xs max-w-[173px]">
            Narrow your search further by
            adding some filters.
          </div>
          <button onClick={() => setOpenModal(true)} className="bg-[#5C61F0] rounded py-3 px-8 w-fit">Build query</button>
        </aside>
        <div className="w-full flex flex-col gap-8">
          <div className="flex gap-6">
            <div className="bg-slate-50/5 text-sm w-[300px] border-[1px] rounded border-[#404348] py-3 px-6 flex gap-2">
              <img src="Search.svg" />
              <input className="bg-transparent w-full outline-none" placeholder="Search for product feedback" />
            </div>
            <button className="bg-slate-50/5 border-[1px] rounded border-[#404348] py-3 px-6 flex gap-2"><img src='/download.svg' /><p>Export feedback</p></button>
            <button className="bg-[#5C61F0] rounded py-3 px-5 w-fit">View Feedback</button>
            <button className="bg-slate-50/5 border-[1px] rounded border-[#404348] py-3 px-6 flex gap-2"><img src="/Calendar.svg" /><p>July 28, 2020 - Oct 28, 2020</p></button>
          </div>
          <div className="bg-[#282B30] border-2 border-[#404348] h-[121px] w-full max-w-5xl rounded"></div>
          <div className="bg-[#282B30] border-2 border-[#404348] h-[121px] w-full max-w-5xl rounded"></div>
          <div className="bg-[#282B30] border-2 border-[#404348] h-[121px] w-full max-w-5xl rounded"></div>
          <div className="bg-[#282B30] border-2 border-[#404348] h-[121px] w-full max-w-5xl rounded"></div>
        </div>
      </section>
      {openModal && <QueryBuilderModal queryBuilder={queryBuilder} setOpenModal={setOpenModal} />}
    </main>
  );
}
