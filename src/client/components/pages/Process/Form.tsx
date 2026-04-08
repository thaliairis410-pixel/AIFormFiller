import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import getFormDefaultValues from "../../../utils/get-form-default-values";
import upload from "../../../utils/upload";

export default function Form({
  setDomains,
}: {
  setDomains: React.Dispatch<React.SetStateAction<string[] | undefined>>;
}) {
  const [defaultValues, setDefaultValues] = useState<Record<string, string>>(
    {},
  );

  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm({ mode: "onBlur" });

  const errorClassName = "bg-red-50 border-red-300 outline-red-500";
  const validClassName = "border-zinc-300 bg-transparent";

  const [submitting, setSubmitting] = useState(false);
  const onSuccess = useCallback(
    (domains: string[]) => {
      setDomains(domains);
    },
    [setDomains],
  );

  useEffect(() => {
    getFormDefaultValues().then((data) =>
      setDefaultValues(data as Record<string, string>),
    );
  }, []);

  useEffect(() => {
    for (const key in defaultValues) {
      setValue(key, defaultValues[key]);
    }
  }, [defaultValues, setValue]);

  return (
    <div className="bg-white border border-zinc-300 p-6 rounded-xl h-fit md:sticky top-38">
      <form
        onSubmit={handleSubmit(async (_, e) => {
          setSubmitting(true);
          await upload(e, onSuccess);
          setSubmitting(false);
        })}
        className="space-y-3"
      >
        <input type="hidden" value={defaultValues.id} name="id" />

        {/* File upload */}
        <div className="bg-zinc-100 border border-dashed rounded-xl border-zinc-300 p-6 text-center text-sm text-zinc-600">
          <div>Drag & drop CSV/TXT file</div>
          <div>or</div>
          <button
            onClick={() => fileInputRef.current?.click()}
            type="button"
            className="text-blue-600 underline cursor-pointer"
          >
            Browse Files
          </button>
          <input
            ref={fileInputRef}
            type="file"
            name="file"
            hidden
            accept=".txt,.csv"
          />
        </div>

        {/* Full Name */}
        <div className="flex flex-col text-sm gap-1">
          <label htmlFor="full-name">
            Full Name<sup className="text-red-400">*</sup>
          </label>
          <input
            {...register("name", {
              required: { value: true, message: "Enter your full name" },
              pattern: {
                value: /^[a-zA-Z\-']+(\s[a-zA-Z\-']+)*$/,
                message:
                  "Names can only contain letters and/or -, ' characters",
              },
            })}
            type="text"
            id="full-name"
            placeholder="John Doe"
            className={`${errors.fullName ? errorClassName : validClassName} p-3 border rounded-xl capitalize`}
          />
          {errors.fullName && (
            <div className="text-red-400 text-xs">
              {errors.fullName.message as string}
            </div>
          )}
        </div>

        {/* Email */}
        <div className="flex flex-col text-sm gap-1">
          <label htmlFor="email">
            Email<sup className="text-red-400">*</sup>
          </label>
          <input
            {...register("email", {
              required: { value: true, message: "Enter your email" },
              pattern: {
                value: /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9._+-]+\.[a-zA-Z0-9]+$/,
                message: "Enter a valid email",
              },
            })}
            type="email"
            id="email"
            placeholder="johndoe@lost.com"
            className={`${errors.email ? errorClassName : validClassName} p-3 border rounded-xl lowercase`}
          />
          {errors.email && (
            <div className="text-red-400 text-xs">
              {errors.email.message as string}
            </div>
          )}
        </div>

        {/* Phone */}
        <div className="flex flex-col text-sm gap-1">
          <label htmlFor="phone-number">
            Phone Number<sup className="text-red-400">*</sup>
          </label>
          <input
            {...register("phone", {
              required: {
                value: true,
                message: "Enter your phone number",
              },
              pattern: {
                value: /^\+?[\s0-9-]{5,}$/,
                message: "Enter a valid phone number",
              },
            })}
            type="tel"
            id="phone-number"
            placeholder="+19023839"
            className={`${errors.phoneNumber ? errorClassName : validClassName} p-3 border rounded-xl`}
          />
          {errors.phoneNumber && (
            <div className="text-red-400 text-xs">
              {errors.phoneNumber.message as string}
            </div>
          )}
        </div>

        {/* Company + Position */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col text-sm gap-1">
            <label htmlFor="company-name">
              Company Name<sup className="text-red-400">*</sup>
            </label>
            <input
              {...register("companyName", {
                required: {
                  value: true,
                  message: "Enter your company name",
                },
                pattern: {
                  value: /^[a-zA-Z\-']+(\s[a-zA-Z\-']+)*$/,
                  message:
                    "Names can only contain letters and/or -, ' characters",
                },
              })}
              type="text"
              id="company-name"
              placeholder="Lost Corp"
              className={`${errors.companyName ? errorClassName : validClassName} p-3 border rounded-xl capitalize`}
            />
            {errors.companyName && (
              <div className="text-red-400 text-xs">
                {errors.companyName.message as string}
              </div>
            )}
          </div>

          <div className="flex flex-col text-sm gap-1">
            <label htmlFor="position">
              Position<sup className="text-red-400">*</sup>
            </label>
            <input
              {...register("position", {
                required: { value: true, message: "Enter your position" },
                pattern: {
                  value: /^[a-zA-Z\-']+(\s[a-zA-Z\-']+)*$/,
                  message: "Only letters and/or -, ' are allowed",
                },
              })}
              type="text"
              id="position"
              placeholder="Chief Executive Officer"
              className={`${errors.position ? errorClassName : validClassName} p-3 border rounded-xl capitalize`}
            />
            {errors.position && (
              <div className="text-red-400 text-xs">
                {errors.position.message as string}
              </div>
            )}
          </div>
        </div>

        {/* Country + City */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col text-sm gap-1">
            <label htmlFor="country">
              Country<sup className="text-red-400">*</sup>
            </label>
            <input
              {...register("country", {
                required: {
                  value: true,
                  message: "Enter your country",
                },
                pattern: {
                  value: /^[a-zA-Z\-']+(\s[a-zA-Z\-']+)*$/,
                  message:
                    "Names can only contain letters and/or -, ' characters",
                },
              })}
              type="text"
              id="country"
              placeholder="United States of America"
              className={`${errors.country ? errorClassName : validClassName} p-3 border rounded-xl capitalize`}
            />
            {errors.country && (
              <div className="text-red-400 text-xs">
                {errors.country?.message as string}
              </div>
            )}
          </div>

          <div className="flex flex-col text-sm gap-1">
            <label htmlFor="position">
              City<sup className="text-red-400">*</sup>
            </label>
            <input
              {...register("city", {
                required: { value: true, message: "Enter your city" },
                pattern: {
                  value: /^[a-zA-Z\-']+(\s[a-zA-Z\-']+)*$/,
                  message: "Only letters and/or -, ' are allowed",
                },
              })}
              type="text"
              id="city"
              placeholder="Chicago"
              className={`${errors.city ? errorClassName : validClassName} p-3 border rounded-xl capitalize`}
            />
            {errors.city && (
              <div className="text-red-400 text-xs">
                {errors.city.message as string}
              </div>
            )}
          </div>
        </div>

        {/* Town + Postal code */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col text-sm gap-1">
            <label htmlFor="country">
              Town<sup className="text-red-400">*</sup>
            </label>
            <input
              {...register("town", {
                required: {
                  value: true,
                  message: "Enter your town",
                },
                pattern: {
                  value: /^[a-zA-Z\-']+(\s[a-zA-Z\-']+)*$/,
                  message:
                    "Names can only contain letters and/or -, ' characters",
                },
              })}
              type="text"
              id="town"
              placeholder="Your call"
              className={`${errors.town ? errorClassName : validClassName} p-3 border rounded-xl capitalize`}
            />
            {errors.town && (
              <div className="text-red-400 text-xs">
                {errors.town?.message as string}
              </div>
            )}
          </div>

          <div className="flex flex-col text-sm gap-1">
            <label htmlFor="position">
              Postal Code<sup className="text-red-400">*</sup>
            </label>
            <input
              {...register("postalCode", {
                required: { value: true, message: "Enter your postal code" },
                pattern: {
                  value: /^[\d]+$/,
                  message: "Only numbers are allowed",
                },
              })}
              type="text"
              id="city"
              placeholder="900111"
              className={`${errors.postalCode ? errorClassName : validClassName} p-3 border rounded-xl capitalize`}
            />
            {errors.postalCode && (
              <div className="text-red-400 text-xs">
                {errors.postalCode.message as string}
              </div>
            )}
          </div>
        </div>

        {/* Address */}
        <div className="flex flex-col text-sm gap-1">
          <label htmlFor="address">
            Address<sup className="text-red-400">*</sup>
          </label>
          <input
            {...register("address", {
              required: {
                value: true,
                message: "Address cannot be empty",
              },
            })}
            type="text"
            id="address"
            placeholder="No. 6 Crystal Avenue"
            className={`${errors.address ? errorClassName : validClassName} p-3 border rounded-xl capitalize`}
          />
          {errors.address && (
            <div className="text-red-400 text-xs">
              {errors.address.message as string}
            </div>
          )}
        </div>

        {/* Message */}
        <div className="flex flex-col text-sm gap-1">
          <label htmlFor="message">
            Message<sup className="text-red-400">*</sup>
          </label>
          <textarea
            {...register("message", {
              required: {
                value: true,
                message: "Message cannot be empty",
              },
            })}
            id="message"
            placeholder="Hi, I'm John Doe..."
            rows={4}
            className={`${errors.message ? errorClassName : validClassName} p-3 border rounded-xl capitalize`}
          />
          {errors.message && (
            <div className="text-red-400 text-xs">
              {errors.message.message as string}
            </div>
          )}
        </div>

        <button
          className="text-sm bg-blue-600 text-white p-2 cursor-pointer transition active:scale-95 rounded-xl w-full hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={submitting}
          type="submit"
        >
          {submitting ? "Submitting..." : "Submit for Processing"}
        </button>
      </form>
    </div>
  );
}
