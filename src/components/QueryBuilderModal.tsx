import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { QueryBuilder } from "@/lib/QueryBuilder";
import { Rule, RuleGroup } from "@/models/rules.model";
import { CONJUNCTION } from '@/constants/conjunction';
import { RULETYPE } from '@/constants/rule-type-enum';

type QueryBuilderModalProps = {
    setOpenModal: Dispatch<SetStateAction<boolean>>;
    queryBuilder: QueryBuilder
}

const fieldType: string[] = ['Theme', 'Sub-theme', 'Reason', 'Language', 'Source', 'Rating', 'Time Period', 'Customer ID']
const conditionType: string[] = ['Equals', 'Does not equal', 'Like', 'Not like', 'Is Empty', 'Is', 'Is not']

const QueryBuilderModal = ({ setOpenModal, queryBuilder }: QueryBuilderModalProps) => {

    const [mainConjunction, setMainConjunction] = useState<CONJUNCTION>(CONJUNCTION.and)
    const [field, setField] = useState<Rule['field']>()
    const [condition, setCondition] = useState<Rule['condition']>()
    const [value, setValue] = useState<string>('')

    const [ruleGroupObject, setRuleGroupObject] = useState<RuleGroup | null>(null);
    const [ruleGroupString, setRuleGroupString] = useState('');

    // Handler to update the rule group
    const handleAddRule = () => {
        queryBuilder
            .addRule({ field: field, condition: condition, value: [value], type: 'rule' })
            .setConjunction('AND');

        // Update state to trigger re-render
        setRuleGroupObject(queryBuilder.getRuleGroupObject());
        setRuleGroupString(queryBuilder.getRuleGroupString());
        setField(undefined)
        setCondition(undefined)
        setValue('')
    };

    const handleConjunctionChange = (conjunction: CONJUNCTION) => {
        queryBuilder
            .setConjunction(conjunction);

        // Update state to trigger re-render
        setRuleGroupObject(queryBuilder.getRuleGroupObject());
        setRuleGroupString(queryBuilder.getRuleGroupString());
    };

    useEffect(() => {
        const closePopUp = (e: MouseEvent) => {
            if (e.target && (e.target as Element).id == "modal_background") {
                setOpenModal(false)
            }
        };

        document.body.addEventListener("click", closePopUp);

        return () => document.body.removeEventListener("click", closePopUp);
    });

    useEffect(() => {
        if (ruleGroupObject == null && ruleGroupString == '' && queryBuilder) {
            setRuleGroupObject(queryBuilder.getRuleGroupObject())
            setRuleGroupString(queryBuilder.getRuleGroupString())
        }
    }, [queryBuilder])

    console.log(ruleGroupObject)
    console.log(queryBuilder)

    return (
        <div id="modal_background" className="fixed min-h-screen top-0 left-0 w-screen bg-black/30 flex items-center justify-center z-10">
            <div className='bg-[#1D2025] z-20 w-[960px]'>
                <div className='bg-[#5C61F0] h-[116px] relative px-5 flex flex-col gap-1 justify-center'>
                    <p className='font-semibold'>Build your query</p>
                    <div className='bg-[#4338CA] p-2 rounded h-10'><strong>Query: </strong>{ruleGroupString}</div>
                    <button onClick={() => setOpenModal(false)} className='absolute top-3 right-4 bg-[#4338CA] w-6 h-6 rounded-[6px]'><img src='X.svg' /></button>
                </div>
                <section className={`mt-5 h-[65vh] overflow-y-scroll mx-7 ${ruleGroupObject && ruleGroupObject.children.filter(child => child.type === RULETYPE.rule_group).length > 0 ? "bg-[#282B30] p-4 rounded border-[1px] border-[#404348]" : ""}`}>
                    {ruleGroupObject && ruleGroupObject.children.filter(child => child.type === RULETYPE.rule_group).length > 0 &&
                        <div className='bg-white/5 border-[1px] flex border-[#404348] relative w-24 h-8 rounded mb-7'>
                            <button onClick={() => setMainConjunction(CONJUNCTION.and)} className={`w-12 block text-center rounded-l ${mainConjunction == CONJUNCTION.and ? 'bg-[#5C61F0]' : ''}`}>AND</button>
                            <button onClick={() => setMainConjunction(CONJUNCTION.or)} className={`w-12 block text-center rounded-r ${mainConjunction == CONJUNCTION.or ? 'bg-[#5C61F0]' : ''}`}>OR</button>
                        </div>
                    }
                    <div className='bg-[#282B30] p-4 rounded border-[1px] border-[#404348] mt-3'>
                        {ruleGroupObject && (
                            <>
                                {ruleGroupObject.children.length > 1 &&
                                    <div className='bg-white/5 border-[1px] flex border-[#404348] relative w-24 h-8 rounded mb-7'>
                                        <button onClick={() => handleConjunctionChange(CONJUNCTION.and)} className={`w-12 block text-center rounded-l ${ruleGroupObject.conjunction == CONJUNCTION.and ? 'bg-[#5C61F0]' : ''}`}>AND</button>
                                        <button onClick={() => handleConjunctionChange(CONJUNCTION.or)} className={`w-12 block text-center rounded-r ${ruleGroupObject.conjunction == CONJUNCTION.or ? 'bg-[#5C61F0]' : ''}`}>OR</button>
                                    </div>
                                }
                                {ruleGroupObject.children.map((data, index) => {
                                    switch (true) {
                                        case data.type == "rule":
                                            return (
                                                <div key={index} className='flex w-full gap-4 mb-4'>
                                                    <div className='flex flex-col'>
                                                        <label className='mb-2 text-xs' htmlFor="country">Field:</label>
                                                        <select defaultValue={data.field} className='px-3 py-2 rounded outline-none w-[250px] border-[#404348] border-[1px] bg-white/5 h-9 text-[14px]' name="country" id="country">
                                                            {fieldType.map((data, index) => <option key={index} className='text-black' value={data}>{data}</option>)}
                                                        </select>
                                                    </div>
                                                    <div className='flex flex-col'>
                                                        <label className='mb-2 text-xs' htmlFor="country">Condition:</label>
                                                        <select defaultValue={data.condition} className='px-3 py-2 rounded outline-none w-[250px] border-[#404348] border-[1px] bg-white/5 h-9 text-[14px]' name="country" id="country">
                                                            {conditionType.map((data, index) => <option key={index} className='text-black' value={data}>{data}</option>)}
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
                            </>
                        )}
                        <div className='flex w-full gap-4 mb-4'>
                            <div className='flex flex-col'>
                                <label className='mb-2 text-xs' htmlFor="country">Field:</label>
                                <select value={field} onChange={(e) => setField(e.target.value as Rule["field"])} className='px-3 py-2 rounded outline-none w-[250px] border-[#404348] border-[1px] bg-white/5 h-9 text-[14px]' name="country" id="country">
                                    <option className='text-black' value={undefined}></option>
                                    {fieldType.map((data, index) => <option key={index} className='text-black' value={data}>{data}</option>)}
                                </select>
                            </div>
                            <div className='flex flex-col'>
                                <label className='mb-2 text-xs' htmlFor="country">Condition:</label>
                                <select value={condition} onChange={(e) => setCondition(e.target.value as Rule['condition'])} className='px-3 py-2 rounded outline-none w-[250px] border-[#404348] border-[1px] bg-white/5 h-9 text-[14px]' name="country" id="country">
                                    <option className='text-black' value={undefined}></option>
                                    {conditionType.map((data, index) => <option key={index} className='text-black' value={data}>{data}</option>)}
                                </select>
                            </div>
                            <div className='flex flex-col'>
                                <label className='mb-2 text-xs' htmlFor="country">Value:</label>
                                <input value={value} onChange={(e) => setValue(e.target.value)} className='px-3 py-2 rounded outline-none w-[250px] border-[#404348] border-[1px] bg-white/5 h-9 text-[14px]' name="country" id="country" />
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                handleAddRule()
                            }}
                            className='px-[17px] py-[9px] bg-[#4F46E5] rounded-[6px] outline-none'
                        >
                            + Add filter
                        </button>
                    </div>
                    <div className='h-5 w-8 border-r-[1px] border-r-[#4F4F4F]' />
                    <button className='px-[17px] py-[9px] bg-[#4F46E5] rounded-[6px] outline-none'>+ Add new group filter</button>
                </section>
                <div className='flex justify-between mx-5 my-8'>
                    <button onClick={() => setOpenModal(false)} className='px-[17px] py-[9px] bg-[#6D7175] rounded-[6px] outline-none'>Back</button>
                    <button className='px-[17px] py-[9px] bg-[#4F46E5] rounded-[6px] outline-none'>Finish</button>
                </div>
            </div>
        </div>
    );
};

export default QueryBuilderModal;