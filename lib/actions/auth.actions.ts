"use server";

import { success } from "better-auth";
import { auth } from "../better-auth/auth";
import {inngest} from "../inngest/client";

export const signUpWithEmail = async ({email,password,fullName,country,investmentGoals,preferredIndustry}: SignUpFormData) => {
    try {
        const response = await auth.api.signUpEmail({ body: {  email,  password, name: fullName } });

        if (response) {
            await inngest.send({
                name: 'app/user.created',
                data: {
                    email,
                    name: fullName,
                    country,
                    investmentGoals,
                    preferredIndustry,
                    riskTolerance: 'Medium' // Default value, can be modified to accept user input
                }
            })
        }
        return {success:true,message:'Sign up successful',data:response};
    } catch (e) {
        console.log('Sign up failed', e)
        return {success:false,error:'Sign up failed'}
    }
}