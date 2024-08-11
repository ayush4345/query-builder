import { CONJUNCTION } from '@/constants/conjunction';
import { ConditionType, FieldType } from '@/constants/options';
import { RuleGroup } from '@/models/rules.model';
import React from 'react';

interface RuleGroupProps {
    data: RuleGroup
}

export const RuleGroupBox: React.FC<RuleGroupProps> = ({ data }) => {
    return (
        <>
            <div className='bg-[#282B30] p-4 rounded border-[1px] border-[#404348]'>
                <div className='bg-white/5 border-[1px] flex border-[#404348] relative w-24 h-8 rounded mb-7'>
                    <button className={`w-12 block text-center rounded-l ${data.conjunction == CONJUNCTION.and ? 'bg-[#5C61F0]' : ''}`}>AND</button>
                    <button className={`w-12 block text-center rounded-r ${data.conjunction == CONJUNCTION.or ? 'bg-[#5C61F0]' : ''}`}>OR</button>
                </div>
                {data.children.map((data, index) => {
                    if (data.type == "rule") {
                        return (
                            <div key={index} className='flex w-full gap-4 mb-4'>
                                <div className='flex flex-col'>
                                    <label className='mb-2 text-xs' htmlFor="country">Field:</label>
                                    <select disabled defaultValue={data.field} className='px-3 py-2 rounded outline-none w-[250px] border-[#404348] border-[1px] bg-white/5 h-9 text-[14px]' name="country" id="country">
                                        {FieldType.map((data, index) => <option key={index} className='text-black' value={data}>{data}</option>)}
                                    </select>
                                </div>
                                <div className='flex flex-col'>
                                    <label className='mb-2 text-xs' htmlFor="country">Condition:</label>
                                    <select disabled defaultValue={data.condition} className='px-3 py-2 rounded outline-none w-[250px] border-[#404348] border-[1px] bg-white/5 h-9 text-[14px]' name="country" id="country">
                                        {ConditionType.map((data, index) => <option key={index} className='text-black' value={data}>{data}</option>)}
                                    </select>
                                </div>
                                <div className='flex flex-col'>
                                    <label className='mb-2 text-xs' htmlFor="country">Value:</label>
                                    <input readOnly defaultValue={data.value} className='px-3 py-2 rounded outline-none w-[250px] border-[#404348] border-[1px] bg-white/5 h-9 text-[14px]' name="country" id="country" />
                                </div>
                            </div>
                        )
                    }
                })}
            </div>
            <div className='h-5 w-8 border-r-[1px] border-r-[#4F4F4F]' />
        </>
    );
};