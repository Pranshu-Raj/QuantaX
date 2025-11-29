"use client";
import InputFields from "@/components/forms/InputFields";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { INVESTMENT_GOALS } from "@/lib/constants";
import { Select } from "@radix-ui/react-select";
import { useForm } from "react-hook-form";
import SelectField from "@/components/forms/SelectField";

const page = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      country: "US",
      investmentGoals: "Growth",
      riskTolerance: "Medium",
      preferredIndustry: "Technology",
    },
    mode: "onBlur",
  });
  const onSubmit = async (data: SignUpFormData) => {
    try {
      // Handle form submission logic here
      console.log("Form Data Submitted: ", data);
    } catch (error) {
      console.error("Error submitting form: ", error);
    }
  };
  return (
    <>
      <h1 className="form-title">Sign Up & Personalize</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <InputFields
          name="fullName"
          label="Full Name"
          placeholder="John Doe"
          register={register}
          error={errors.fullName}
          validation={{ required: "Full name is required", minLength: 2 }}
        />

        <InputFields
          name="email"
          label="Email"
          placeholder="Enter your email"
          register={register}
          error={errors.email}
          validation={{ required: "Email is required", pattern: /^\S+@\S+$/i, message: "Invalid email address" }}
        />

        <InputFields
          name="password"
          label="Password"
          placeholder="Enter a Strong Password"
          type="password"
          register={register}
          error={errors.password}
          validation={{ required: "Password is required", minLength: 8 }}
        />

        <SelectField
          name="Investment Goals"
          label="Investment Goals"
          placeholder="Select your investment goals"
          options={INVESTMENT_GOALS}
          control={control}
          error={errors.investmentGoals}
        /> ;
        

        <Button
          type="submit"
          disabled={isSubmitting}
          className="yellow-btn w-full mt-5">
          {isSubmitting ? "Submitting..." : "Create Your Investing Journey"}
        </Button>
      </form>
    </>
  );
};

export default page;
