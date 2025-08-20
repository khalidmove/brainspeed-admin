import React, { useContext, useState } from 'react'
import isAuth from '@/components/isAuth';
import moment from 'moment';
import { userContext } from './_app';
import Subscription from '@/components/Subscription';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { Api } from '@/services/service'
import { useRouter } from 'next/router'

function SubscriptionManagement(props) {
    const router = useRouter();
    const [user, setUser] = useContext(userContext);
    const [activeSubscriptionPlan, setActiveSubscriptionPlan] = useState(false);

    const submit = (is_on) => {
        props.loader(true)
        let url = `updateSubscription`

        Api("post", url, { is_on }, router).then(
            (res) => {
                console.log("res================>", res.data.incident);
                props.loader(false);

                if (res?.status) {
                    setActiveSubscriptionPlan(is_on)
                    props.toaster({ type: "success", message: res?.data?.message });
                } else {
                    console.log(res?.data?.message);
                    props.toaster({ type: "error", message: res?.data?.message });
                }
            },
            (err) => {
                props.loader(false);
                console.log(err);
                props.toaster({ type: "error", message: err?.data?.message });
                props.toaster({ type: "error", message: err?.message });
            }
        );

    }

    return (
        <div className="bg-white min-h-full py-10 px-5">
            <div className='border-2 rounded-[15px] border-[var(--dark-blue)] p-5'>
                <div className='md:flex justify-between'>
                    <div>
                        <p className='text-2xl font-bold text-black MerriweatherSans'>{`${moment(new Date()).format('DD-MMM-YYYY')} , ${moment(new Date()).format('dddd')}`}</p>
                        <p className='md:text-4xl text-3xl font-bold text-black MerriweatherSans pt-2'>Hello <span className='text-[var(--dark-orange)]'>{user?.name}</span></p>
                    </div>
                    {/* <div className='md:mt-0 mt-5'>
                        <FormGroup>
                            <FormControlLabel control={<Switch checked={activeSubscriptionPlan}
                                onChange={(e) => {
                                    console.log(e)
                                    submit(e.target.checked)
                                }}
                            />} label="Active Subscription Plan" />
                        </FormGroup>
                    </div> */}
                </div>
            </div>

            <Subscription props={props} setActiveSubscriptionPlan={setActiveSubscriptionPlan} />
        </div>
    )
}

export default isAuth(SubscriptionManagement)