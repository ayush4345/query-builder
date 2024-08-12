import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { QueryBuilder } from "@/lib/QueryBuilder";
import { Rule, RuleGroup } from "@/models/rules.model";
import { CONJUNCTION } from '@/constants/conjunction';
import { RULETYPE } from '@/constants/rule-type-enum';
import { RuleGroupBox } from './RuleGroupBox';
import { ConditionType, FieldType } from '@/constants/options';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

type QueryBuilderModalProps = {
    setOpenModal: Dispatch<SetStateAction<boolean>>;
    queryBuilder: QueryBuilder
}

const QueryBuilderModal = ({ setOpenModal, queryBuilder }: QueryBuilderModalProps) => {

    const [mainConjunction, setMainConjunction] = useState<CONJUNCTION>(CONJUNCTION.and)
    const [field, setField] = useState<Rule['field']>()
    const [condition, setCondition] = useState<Rule['condition']>()
    const [value, setValue] = useState<string>('')
    const [viewMore, setViewMore] = useState<boolean>(true)

    const [ruleGroupObject, setRuleGroupObject] = useState<RuleGroup | null>(null);
    const [ruleGroupString, setRuleGroupString] = useState('');

    const updateRuleGroupState = () => {
        setRuleGroupObject(queryBuilder.getRuleGroupObject());
        setRuleGroupString(queryBuilder.getRuleGroupString());
    };

    const handleAddRule = () => {
        if (field == undefined || condition == undefined || value == "") return

        queryBuilder
            .addRule({ field: field, condition: condition, value: [value], type: 'rule' })
            .setConjunction(mainConjunction);

        updateRuleGroupState();
        setField('Theme');
        setCondition('Equals');
        setValue('');
    };

    const handleAddRuleGroup = () => {

        if (ruleGroupObject == null) return

        const rules = ruleGroupObject.children.filter(child => child.type === 'rule');

        if (rules.length > 0) {
            const newRuleGroup: RuleGroup = {
                type: 'rule_group',
                children: rules,
                conjunction: mainConjunction,
                not: false
            };

            const nonRules = ruleGroupObject.children.filter(child => child.type !== 'rule');

            ruleGroupObject.children = [...nonRules, newRuleGroup];

            updateRuleGroupState();
        }
    }

    const handleDeleteRule = ({ field, condition, value }: { field: Rule["field"], condition: Rule["condition"], value: Rule['value'] }) => {

        queryBuilder.deleteRule({ field: field, condition: condition, value: value, type: 'rule' })

        updateRuleGroupState();
    }

    const handleConjunctionChange = (conjunction: CONJUNCTION) => {
        queryBuilder.setConjunction(conjunction);
        updateRuleGroupState();
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

    return (
        <div id="modal_background" className="fixed min-h-screen top-0 left-0 w-screen bg-black/30 flex items-center justify-center z-10">
            <div className='bg-[#1D2025] z-20 w-[960px] rounded overflow-hidden'>
                <div className='bg-[#5C61F0] min-h-[116px] relative px-5 py-4 flex flex-col gap-1 justify-center'>
                    <p className='font-semibold'>{ruleGroupString.length == 0 ? 'Create tag and query' : 'Build your query'}</p>
                    {ruleGroupString.length == 0
                        ? <p className='text-sm text-[#A5B4FC]'>The query you build will be saved in your active view</p>
                        : <div className='flex gap-2'>
                            <div className={`bg-[#4338CA] text-sm leading-[23px] w-full p-2 rounded text-ellipsis ${viewMore ? 'h-[36px] overflow-hidden' : ''}`}><strong>Query: </strong>{ruleGroupString}</div>
                            <button onClick={() => setViewMore(!viewMore)}>{viewMore ? 'more...' : 'less...'}</button>
                        </div>
                    }
                    <button onClick={() => setOpenModal(false)} className='absolute top-3 right-4 bg-[#4338CA] w-6 h-6 rounded-[6px]'><img src='X.svg' /></button>
                </div>
                <section style={{ scrollbarWidth: 'none' }} className={`mt-5 h-[65vh] overflow-y-auto mx-7 ${ruleGroupObject && ruleGroupObject.children.filter(child => child.type === RULETYPE.rule_group).length > 0 ? "bg-[#282B30] p-4 rounded border-[1px] border-[#404348]" : ""}`}>
                    {ruleGroupObject && ruleGroupObject.children.filter(child => child.type === RULETYPE.rule_group).length > 0 &&
                        <div className='bg-white/5 border-[1px] flex border-[#404348] relative w-24 h-8 rounded mb-7'>
                            <button onClick={() => handleConjunctionChange(CONJUNCTION.and)} className={`w-12 block text-center rounded-l ${ruleGroupObject.conjunction == CONJUNCTION.and ? 'bg-[#5C61F0]' : ''}`}>AND</button>
                            <button onClick={() => handleConjunctionChange(CONJUNCTION.or)} className={`w-12 block text-center rounded-r ${ruleGroupObject.conjunction == CONJUNCTION.or ? 'bg-[#5C61F0]' : ''}`}>OR</button>
                        </div>
                    }
                    {
                        ruleGroupObject && ruleGroupObject.children.map((data, index) => {
                            if (data.type == "rule_group") {
                                return (
                                    <RuleGroupBox key={index} data={data} />
                                )
                            }
                        })
                    }
                    <div className='bg-[#282B30] p-4 rounded border-[1px] border-[#404348]'>
                        {ruleGroupObject && (
                            <>
                                {ruleGroupObject.children.length > 1 &&
                                    <div className='bg-white/5 border-[1px] flex border-[#404348] relative w-24 h-8 rounded mb-7'>
                                        <button onClick={() => setMainConjunction(CONJUNCTION.and)} className={`w-12 block text-center rounded-l ${mainConjunction == CONJUNCTION.and ? 'bg-[#5C61F0]' : ''}`}>AND</button>
                                        <button onClick={() => setMainConjunction(CONJUNCTION.or)} className={`w-12 block text-center rounded-r ${mainConjunction == CONJUNCTION.or ? 'bg-[#5C61F0]' : ''}`}>OR</button>
                                    </div>
                                }
                                {ruleGroupObject.children.map((child, index) => {
                                    if (child.type == "rule") {
                                        return (
                                            <div key={index} className='flex items-end w-full gap-4 mb-4'>
                                                <div className='flex flex-col'>
                                                    <label className='mb-2 text-xs' htmlFor={`field-${index}`}>Field:</label>
                                                    <Select disabled value={child.field}>
                                                        <SelectTrigger className="px-3 py-2 rounded outline-none w-[250px] border-[#404348] border-[1px] bg-white/5 h-9 text-[14px] disabled:opacity-100">
                                                            <SelectValue placeholder="Select field" />
                                                        </SelectTrigger>
                                                        <SelectContent className='bg-[#282B30] border-[#404348] border-[1px]'>
                                                            <SelectGroup>
                                                                <SelectLabel className='text-white/50 text-sm font-semibold tracking-[2.5px]'>PREDICTION</SelectLabel>
                                                                {FieldType.slice(0, -1).map((field, idx) => (
                                                                    <SelectItem className='focus:bg-[#C4C4C41A] focus:text-white text-white cursor-pointer' key={idx} value={field}>
                                                                        {field}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectGroup>
                                                            <SelectGroup>
                                                                <SelectLabel className='text-white/50 text-sm font-semibold tracking-[2.5px]'>COMMON</SelectLabel>
                                                                <SelectItem className='focus:bg-[#C4C4C41A] focus:text-white text-white cursor-pointer' value="Customer ID">Customer ID</SelectItem>
                                                            </SelectGroup>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className='flex flex-col'>
                                                    <label className='mb-2 text-xs' htmlFor={`condition-${index}`}>Condition:</label>
                                                    <Select disabled value={child.condition}>
                                                        <SelectTrigger className="px-3 py-2 rounded outline-none w-[250px] border-[#404348] border-[1px] bg-white/5 h-9 text-[14px] disabled:opacity-100">
                                                            <SelectValue placeholder="Select field" />
                                                        </SelectTrigger>
                                                        <SelectContent className='bg-[#282B30] border-[#404348] border-[1px]'>
                                                            {ConditionType.map((condition, idx) => (
                                                                <SelectItem className='focus:bg-[#C4C4C41A] focus:text-white text-white cursor-pointer' key={idx} value={condition}>
                                                                    {condition}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className='flex flex-col'>
                                                    <label className='mb-2 text-xs' htmlFor={`value-${index}`}>Value:</label>
                                                    <input
                                                        readOnly
                                                        value={child.value}
                                                        className='px-3 py-2 rounded outline-none w-[250px] border-[#404348] border-[1px] bg-white/5 h-9 text-[14px]'
                                                        id={`value-${index}`}
                                                    />
                                                </div>
                                                <div role='button' onClick={() => handleDeleteRule({ field: child.field, condition: child.condition, value: child.value })} className='border-[#404348] border-[1px] bg-white/5 w-9 h-9 flex items-center justify-center rounded'>
                                                    <img src="/delete.svg" />
                                                </div>
                                            </div>
                                        )
                                    }
                                })}
                            </>
                        )}
                        <div className='flex w-full gap-4 mb-4'>
                            <div className='flex flex-col'>
                                <label className='mb-2 text-xs' htmlFor="new-field">Field:</label>
                                <Select value={field} onValueChange={(value) => setField(value as Rule["field"])}>
                                    <SelectTrigger className="px-3 py-2 rounded outline-none w-[250px] border-[#404348] border-[1px] bg-white/10 h-9 text-[14px]">
                                        <SelectValue placeholder="Select field" />
                                    </SelectTrigger>
                                    <SelectContent className='bg-[#282B30] border-[#404348] border-[1px]'>
                                        <SelectGroup>
                                            <SelectLabel className='text-white/50 text-sm font-semibold tracking-[2.5px]'>PREDICTION</SelectLabel>
                                            {FieldType.slice(0, -1).map((field, idx) => (
                                                <SelectItem className='focus:bg-[#C4C4C41A] focus:text-white text-white cursor-pointer' key={idx} value={field}>
                                                    {field}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                        <SelectGroup>
                                            <SelectLabel className='text-white/50 text-sm font-semibold tracking-[2.5px]'>COMMON</SelectLabel>
                                            <SelectItem className='focus:bg-[#C4C4C41A] focus:text-white text-white cursor-pointer' value="Customer ID">Customer ID</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className='flex flex-col'>
                                <label className='mb-2 text-xs' htmlFor="new-condition">Condition:</label>
                                <Select value={condition} onValueChange={(value) => setCondition(value as Rule["condition"])}>
                                    <SelectTrigger className="px-3 py-2 rounded outline-none w-[250px] border-[#404348] border-[1px] bg-white/10 h-9 text-[14px]">
                                        <SelectValue placeholder="Select condition" />
                                    </SelectTrigger>
                                    <SelectContent className='bg-[#282B30] border-[#404348] border-[1px]'>
                                        {ConditionType.map((condition, idx) => (
                                            <SelectItem className='focus:bg-[#C4C4C41A] focus:text-white text-white cursor-pointer' key={idx} value={condition}>
                                                {condition}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className='flex flex-col'>
                                <label className='mb-2 text-xs' htmlFor="new-value">Value:</label>
                                <input
                                    value={value}
                                    onChange={(e) => setValue(e.target.value)}
                                    className='px-3 py-2 rounded outline-none w-[250px] border-[#404348] border-[1px] bg-white/10 h-9 text-[14px]'
                                    id="new-value"
                                />
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
                    <button onClick={() => handleAddRuleGroup()} className='px-[17px] py-[9px] bg-[#4F46E5] rounded-[6px] outline-none'>+ Add new group filter</button>
                </section>
                <div className='flex justify-between mx-5 my-8'>
                    <button onClick={() => setOpenModal(false)} className='px-[17px] py-[9px] bg-[#6D7175] rounded-[6px] outline-none'>Back</button>
                    <button onClick={() => setOpenModal(false)} className='px-[17px] py-[9px] bg-[#4F46E5] rounded-[6px] outline-none'>Finish</button>
                </div>
            </div>
        </div>
    );
};

export default QueryBuilderModal;