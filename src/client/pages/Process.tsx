import { useRef } from "react";
import { type FieldValues, useForm } from "react-hook-form";

const Process = () => {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const {
		register,
		formState: { errors },
		handleSubmit,
	} = useForm({ mode: "onBlur" });

	const errorClassName = "bg-red-50 border-red-300 outline-red-500";
	const validClassName = "border-zinc-300 bg-transparent";

	const submit = (form: FieldValues) => alert("Submitted!");

	return (
		<section className="p-6">
			<div className="container space-y-6">
				<h2 className="text-2xl font-bold">Process Emails</h2>

				<div className="container grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="bg-white border border-zinc-300 p-6 rounded-xl">
						<form onSubmit={handleSubmit(submit)} className="space-y-3">
							<div
								className="bg-zinc-100 border border-dashed rounded-xl border-zinc-300 p-6 text-center
							 text-sm text-zinc-600"
							>
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
									placeholder="Othniel Omajali"
									className={`${errors.fullName ? errorClassName : validClassName} p-3 border rounded-xl capitalize`}
								/>
								{errors.fullName && (
									<div className="text-red-400 text-xs">
										{errors.fullName.message as string}
									</div>
								)}
							</div>

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
									placeholder="othnielomajali@gmail.com"
									className={`${errors.email ? errorClassName : validClassName} p-3 border rounded-xl lowercase`}
								/>
								{errors.email && (
									<div className="text-red-400 text-xs">
										{errors.email.message as string}
									</div>
								)}
							</div>

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
									placeholder="+2348080808080"
									className={`${errors.phoneNumber ? errorClassName : validClassName} p-3 border rounded-xl capitalize`}
								/>
								{errors.phoneNumber && (
									<div className="text-red-400 text-xs">
										{errors.phoneNumber.message as string}
									</div>
								)}
							</div>

							<div className="grid grid-cols-2 gap-6">
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
										placeholder="Northbridge Finance"
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

							<div className="flex flex-col text-sm gap-1">
								<label htmlFor="address">Address</label>
								<input
									{...register("address", {
										pattern: {
											value: /^[a-zA-Z\-']+(\s[a-zA-Z\-']+)*$/,
											message: "Only letters and/or -, ' are allowed",
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

							<button
								className="text-sm bg-blue-600 text-white p-2 cursor-pointer transition active:scale-95 rounded-xl w-full"
								type="submit"
							>
								Submit for Processing
							</button>
						</form>
					</div>

					<div className="bg-white border border-zinc-300 p-6 rounded-xl space-y-3">
						<h3 className="text-lg font-semibold">Processing Queue</h3>
						<div className="my-12 text-sm text-zinc-500 text-center">
							Nothing in queue
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Process;
