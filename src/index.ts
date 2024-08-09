case data.type == "rule_group":
                                return (
                                    <div className='bg-[#282B30] p-4 rounded border-[1px] border-[#404348] mt-3'>
                                        <div className='bg-white/5 border-[1px] flex border-[#404348] relative w-24 h-8 rounded mb-7'>
                                            <button className='w-12 block text-center'>AND</button>
                                            <button className='w-12 block text-center'>OR</button>
                                        </div>
                                        {data.children.map((ruleData) => {
                                            if (ruleData.type == "rule") {
                                                return (
                                                    <div className='flex w-full gap-4 mb-4'>
                                                        <div className='flex flex-col'>
                                                            <label className=' text-xs' htmlFor="country">Field:</label>
                                                            <select value={ruleData.field} className='text-black rounded outline-none w-[250px] border-[#404348] border-[1px] bg-white/5 h-9 text-[14px]' name="country" id="country">
                                                                <option value="India">India</option>
                                                                <option value="Sri Lanka">Sri Lanka</option>
                                                                <option value="Australia">Australia</option>
                                                            </select>
                                                        </div>
                                                        <div className='flex flex-col'>
                                                            <label className=' text-xs' htmlFor="country">Condition:</label>
                                                            <select value={ruleData.condition} className='text-black rounded outline-none w-[250px] border-[#404348] border-[1px] bg-white/5 h-9 text-[14px]' name="country" id="country">
                                                                <option value="India">India</option>
                                                                <option value="Sri Lanka">Sri Lanka</option>
                                                                <option value="Australia">Australia</option>
                                                            </select>
                                                        </div>
                                                        <div className='flex flex-col'>
                                                            <label className=' text-xs' htmlFor="country">Value:</label>
                                                            <input value={ruleData.value} className='text-black rounded outline-none w-[250px] border-[#404348] border-[1px] bg-white/5 h-9 text-[14px]' name="country" id="country" />
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        })}
                                        <div className='flex w-full gap-4 mb-4'>
                                            <div className='flex flex-col'>
                                                <label className=' text-xs' htmlFor="country">Field:</label>
                                                <select className='text-black rounded outline-none w-[250px] border-[#404348] border-[1px] bg-white/5 h-9 text-[14px]' name="country" id="country">
                                                    <option value="India">India</option>
                                                    <option value="Sri Lanka">Sri Lanka</option>
                                                    <option value="Australia">Australia</option>
                                                </select>
                                            </div>
                                            <div className='flex flex-col'>
                                                <label className=' text-xs' htmlFor="country">Condition:</label>
                                                <select className='text-black rounded outline-none w-[250px] border-[#404348] border-[1px] bg-white/5 h-9 text-[14px]' name="country" id="country">
                                                    <option value="India">India</option>
                                                    <option value="Sri Lanka">Sri Lanka</option>
                                                    <option value="Australia">Australia</option>
                                                </select>
                                            </div>
                                            <div className='flex flex-col'>
                                                <label className=' text-xs' htmlFor="country">Value:</label>
                                                <input className='text-black rounded outline-none w-[250px] border-[#404348] border-[1px] bg-white/5 h-9 text-[14px]' name="country" id="country" />
                                            </div>
                                        </div>
                                        <button className='px-[17px] py-[9px] bg-[#4F46E5] rounded-[6px] outline-none'>+ Add filter</button>
                                    </div>
                                )