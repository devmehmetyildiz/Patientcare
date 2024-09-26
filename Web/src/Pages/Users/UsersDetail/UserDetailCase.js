import React from 'react'
import { Icon, Label, Popup } from 'semantic-ui-react'

export default function UserDetailCase(props) {

    const { Cases, Departments, Profile, user } = props

    const t = Profile?.i18n?.t
    const activecaseID = user?.CaseID
    const activecase = (Cases.list || []).find(u => u.Uuid === activecaseID)

    const Patientcases = (Cases.list || []).filter(u => u.Isactive).map(cases => {
        let departments = (cases.Departmentuuids || [])
            .map(u => {
                const department = (Departments.list || []).find(department => department.Uuid === u.DepartmentID)
                if (department) {
                    return department
                } else {
                    return null
                }
            })
            .filter(u => u !== null);
        let Ishavepersonels = false;
        (departments || []).forEach(department => {
            if (department?.Ishavepersonels) {
                Ishavepersonels = true
            }
        });

        if (Ishavepersonels) {
            return cases
        } else {
            return null
        }
    }).filter(u => u !== null);

    return (
        <div className='relative bg-white shadow-lg w-full font-poppins rounded-lg flex flex-col justify-center items-center  p-4 m-4 mt-0 min-w-[250px]'>
            <div className='my-4 !text-[#2355a0] text-lg font-extrabold' >{(t('Pages.Users.Detail.Case.Header'))}</div>
            {activecase
                ? <Label size='large' className='!text-white' basic style={{ backgroundColor: activecase?.Casecolor }}>{activecase?.Name}</Label>
                : <div className=' font-semibold text-[#777777dd]'>
                    {t('Pages.Users.Detail.Case.Messages.NoCaseFound')}
                </div>}
            <Popup
                on={'hover'}
                content={
                    <div className='gap-2 flex flex-nowrap justify-center items-center flex-col'>
                        {Patientcases.map((item, index) => {
                            return <div key={index} className='w-full gap-4 flex flex-row justify-between items-center'>
                                <div>{item?.Name}</div>
                                <div style={{ backgroundColor: item.Casecolor }} className='p-2 rounded-full'></div>
                            </div>
                        })}
                    </div>
                }
                trigger={
                    <div className='cursor-pointer absolute top-1 right-1'>
                        <Icon name='attention' />
                    </div>
                }
            />
        </div>
    )
}
