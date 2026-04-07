import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import useProcessActivity from "../hooks/useProcessActivity";
import type { QueueItem } from "../types";
import getSubmissionStatus from "../utils/get-submission-status";
import upload from "../utils/upload";

const Process = () => {
  const { queue, setQueue } = useProcessActivity();

  const defaultValues = {
    fullName: "John Doe",
    email: "johndoe@example.com",
    phoneNumber: "+123456789",
    companyName: "Acme Corporation",
    position: "Software Engineer",
    address: "123 Main Street, New York, NY 10001",
    message: "Hello, I would like to get in touch regarding your services.",
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ mode: "onBlur", defaultValues });

  const errorClassName = "bg-red-50 border-red-300 outline-red-500";
  const validClassName = "border-zinc-300 bg-transparent";

  const [domains, setDomains] = useState<string[]>();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined;

    async function getLiveUpdates() {
      if (timeout) clearTimeout(timeout);

      const updates: QueueItem[] | null = await getSubmissionStatus({
        domains: domains!,
      });

      if (updates === null) {
        toast.warning("Failed to fetch live updates. Retrying in 5s...");
      } else {
        setQueue(updates);
      }

      timeout = setTimeout(getLiveUpdates, 5000);
    }

    if (domains?.length) {
      getLiveUpdates();
    }

    return () => clearTimeout(timeout);
  }, [domains, setQueue]);

  const onSuccess = useCallback(
    (domains: string[]) => {
      // Optimistically seed the queue as PENDING
      const initial: QueueItem[] = domains.map((domain) => ({
        id: domain,
        domain,
        status: "PENDING",
        createdAt: new Date().toISOString(),
      }));
      setQueue(initial);
      setDomains(domains);
    },
    [setQueue],
  );

  const getStatusColor = (status: QueueItem["status"]) => {
    if (status === "PENDING") return "text-yellow-500";
    if (status === "FAILED") return "text-red-500";
    return "text-green-500";
  };

  const getStatusBg = (status: QueueItem["status"]) => {
    if (status === "PENDING") return "bg-yellow-50 ring-yellow-200";
    if (status === "FAILED") return "bg-red-50 ring-red-200";
    return "bg-green-50 ring-green-200";
  };

  return (
    <section className="p-6">
      <div className="container space-y-6">
        <h2 className="text-2xl font-bold md:sticky top-24">Process Emails</h2>

        <div className="container grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Form */}
          <div className="bg-white border border-zinc-300 p-6 rounded-xl h-fit md:sticky top-38">
            <form
              onSubmit={handleSubmit(async (_, e) => {
                setSubmitting(true);
                await upload(e, onSuccess);
                setSubmitting(false);
              })}
              className="space-y-3"
            >
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
                  {...register("fullName", {
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
                      value:
                        /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9._+-]+\.[a-zA-Z0-9]+$/,
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
                  {...register("phoneNumber", {
                    required: {
                      value: true,
                      message: "Enter your phone number",
                    },
                    pattern: {
                      value: /^\+?[0-9]{5,}$/,
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

          {/* Queue Panel */}
          <div className="bg-white border border-zinc-300 p-6 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Processing Queue</h3>
              {queue && queue.length > 0 && (
                <span className="text-xs text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full border border-zinc-200">
                  {queue.length} domain{queue.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>

            {!queue || queue.length === 0 ? (
              <div className="my-12 text-sm text-zinc-400 text-center">
                Nothing in queue. Upload a file to begin.
              </div>
            ) : (
              <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
                {queue.map((item) => (
                  <div
                    key={item.id}
                    className={`flex justify-between items-center p-3 rounded-lg ring-1 ${getStatusBg(item.status)}`}
                  >
                    <div className="text-sm text-zinc-700 truncate">
                      {item.domain}
                    </div>
                    <div
                      className={`text-xs font-semibold ml-4 shrink-0 ${getStatusColor(item.status)}`}
                    >
                      {item.status}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;
