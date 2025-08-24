"use client";
import { createClient } from "@/utils/supabase/client";
import GoogleSignInButton from "./GoogleSignInButton";
import { useState } from "react";
import BasicInput from "@/components/BasicInput";
import BasicButton from "@/components/BasicButton";
import { toast } from "react-toastify";

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [isSignUp, setIsSignUp] = useState(false);

	const signInWithGoogle = async () => {
		const supabase = createClient();
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: "google",
			options: {
				redirectTo: process.env.NEXT_PUBLIC_BASE_URL + "/auth/callback",
			},
		});
		if (error) {
			toast.error("Google authentication not available in local development");
		}
	};

	const signInWithEmail = async () => {
		if (!email || !password) {
			toast.error("Please enter email and password");
			return;
		}

		setLoading(true);
		const supabase = createClient();

		try {
			if (isSignUp) {
				const { data, error } = await supabase.auth.signUp({
					email,
					password,
					options: {
						emailRedirectTo:
							process.env.NEXT_PUBLIC_BASE_URL + "/auth/callback",
					},
				});
				if (error) {
					toast.error(error.message);
				} else {
					toast.success("Account created! You can now sign in.");
					setIsSignUp(false);
				}
			} else {
				const { data, error } = await supabase.auth.signInWithPassword({
					email,
					password,
				});
				if (error) {
					toast.error(error.message);
				} else {
					toast.success("Signed in successfully!");
					window.location.href = "/app";
				}
			}
		} catch (error) {
			toast.error("An error occurred");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex flex-col items-center w-full pt-32 space-y-6">
			<div className="w-full max-w-md space-y-4">
				<h1 className="text-2xl font-bold text-center">
					{isSignUp ? "Sign Up" : "Sign In"}
				</h1>

				<div className="space-y-4 p-6 border rounded-lg">
					<BasicInput
						type="email"
						placeholder="Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<BasicInput
						type="password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<BasicButton
						onClick={signInWithEmail}
						disabled={loading}
						className="w-full"
					>
						{loading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
					</BasicButton>

					<button
						onClick={() => setIsSignUp(!isSignUp)}
						className="w-full text-sm text-blue-600 hover:underline"
					>
						{isSignUp
							? "Already have an account? Sign In"
							: "Need an account? Sign Up"}
					</button>
				</div>

				<div className="flex items-center">
					<div className="flex-1 border-t"></div>
					<span className="px-3 text-gray-500 text-sm">OR</span>
					<div className="flex-1 border-t"></div>
				</div>
			</div>

			<GoogleSignInButton onClick={signInWithGoogle} />

			<p className="text-sm text-gray-500 text-center max-w-md">
				For local development, use email authentication. Google sign-in requires
				additional configuration.
			</p>
		</div>
	);
}
