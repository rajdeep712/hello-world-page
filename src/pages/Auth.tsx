import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

const signUpSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  email: z.string().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  phone: z.string().min(10, "Phone must be at least 10 digits").max(15, "Phone must be less than 15 digits"),
  password: z.string().min(6, "Password must be at least 6 characters").max(72, "Password must be less than 72 characters"),
});

const signInSchema = z.object({
  email: z.string().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  password: z.string().min(1, "Password is required"),
});

type AuthStep = "form" | "otp";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authStep, setAuthStep] = useState<AuthStep>("form");
  const [otpValue, setOtpValue] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    phone: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const { signIn, signUp, signInWithGoogle, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  const redirectTo = searchParams.get('redirect') || '/';

  useEffect(() => {
    if (user) {
      navigate(redirectTo);
    }
  }, [user, navigate, redirectTo]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    try {
      if (isLogin) {
        signInSchema.parse({ email: formData.email, password: formData.password });
      } else {
        signUpSchema.parse(formData);
      }
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: { [key: string]: string } = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const updateProfilePhone = async (userId: string, phone: string) => {
    await supabase
      .from('profiles')
      .update({ phone })
      .eq('user_id', userId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            toast({
              title: "Login Failed",
              description: "Invalid email or password. Please try again.",
              variant: "destructive",
            });
          } else if (error.message.includes("Email not confirmed")) {
            // User hasn't verified email yet, show OTP input
            setPendingEmail(formData.email);
            setAuthStep("otp");
            toast({
              title: "Email Verification Required",
              description: "Please check your email for the verification code.",
            });
          } else {
            toast({
              title: "Login Failed",
              description: error.message,
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Welcome back!",
            description: "You have successfully logged in.",
          });
        }
      } else {
        const { error, data } = await signUp(formData.email, formData.password, formData.fullName);
        if (error) {
          if (error.message.includes("already registered")) {
            toast({
              title: "Account Exists",
              description: "This email is already registered. Please sign in instead.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Sign Up Failed",
              description: error.message,
              variant: "destructive",
            });
          }
        } else {
          if (data?.user) {
            setTimeout(() => updateProfilePhone(data.user.id, formData.phone), 500);
          }
          // Show OTP verification step
          setPendingEmail(formData.email);
          setAuthStep("otp");
          toast({
            title: "Verification Code Sent",
            description: "Please check your email for the 6-digit verification code.",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otpValue.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter the complete 6-digit verification code.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email: pendingEmail,
        token: otpValue,
        type: "email",
      });

      if (error) {
        toast({
          title: "Verification Failed",
          description: error.message || "Invalid or expired code. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Email Verified!",
          description: "Your account has been verified successfully.",
        });
        // User will be automatically signed in and redirected via useEffect
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: pendingEmail,
      });

      if (error) {
        toast({
          title: "Failed to Resend",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Code Resent",
          description: "A new verification code has been sent to your email.",
        });
        setOtpValue("");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBackToForm = () => {
    setAuthStep("form");
    setOtpValue("");
    setPendingEmail("");
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const { error } = await signInWithGoogle();
    if (error) {
      toast({
        title: "Google Sign In Failed",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{isLogin ? "Sign In" : "Sign Up"} | Bosco By Shivangi</title>
        <meta
          name="description"
          content="Sign in or create an account at Bosco to manage your orders and workshop bookings."
        />
      </Helmet>

      <div className="min-h-screen bg-paper">
        <Navigation />
        
        <main className="pt-32 pb-24">
          <div className="container mx-auto px-6 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              className="max-w-md mx-auto"
            >
              {/* Header */}
              <div className="text-center mb-12">
                <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">
                  {authStep === "otp" ? "Verification" : isLogin ? "Welcome Back" : "Join Us"}
                </p>
                <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-4">
                  {authStep === "otp" ? "Enter Code" : isLogin ? "Sign In" : "Create Account"}
                </h1>
                <div className="w-12 h-px bg-border mx-auto" />
              </div>

              {/* Form Card */}
              <div className="bg-card border border-border p-8 md:p-10">
                <AnimatePresence mode="wait">
                  {authStep === "otp" ? (
                    <motion.div
                      key="otp"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Back Button */}
                      <button
                        type="button"
                        onClick={handleBackToForm}
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm">Back</span>
                      </button>

                      <div className="text-center space-y-6">
                        <div className="space-y-2">
                          <p className="text-muted-foreground">
                            We sent a verification code to
                          </p>
                          <p className="font-medium text-foreground">{pendingEmail}</p>
                        </div>

                        {/* OTP Input */}
                        <div className="flex justify-center py-4">
                          <InputOTP
                            maxLength={6}
                            value={otpValue}
                            onChange={setOtpValue}
                          >
                            <InputOTPGroup>
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                              <InputOTPSlot index={2} />
                              <InputOTPSlot index={3} />
                              <InputOTPSlot index={4} />
                              <InputOTPSlot index={5} />
                            </InputOTPGroup>
                          </InputOTP>
                        </div>

                        <Button
                          onClick={handleVerifyOtp}
                          className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 text-sm tracking-widest uppercase"
                          disabled={loading || otpValue.length !== 6}
                        >
                          {loading ? "Verifying..." : "Verify Email"}
                        </Button>

                        <div className="pt-4 border-t border-border">
                          <p className="text-sm text-muted-foreground mb-2">
                            Didn't receive the code?
                          </p>
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={handleResendOtp}
                            disabled={loading}
                            className="text-primary hover:text-primary/80"
                          >
                            Resend Code
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="form"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Toggle Buttons */}
                      <div className="flex border-b border-border mb-8">
                        <button
                          type="button"
                          className={`flex-1 pb-4 text-sm tracking-wide font-sans transition-all duration-300 ${
                            isLogin
                              ? "text-foreground border-b-2 border-primary -mb-px"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                          onClick={() => {
                            setIsLogin(true);
                            setErrors({});
                          }}
                        >
                          Sign In
                        </button>
                        <button
                          type="button"
                          className={`flex-1 pb-4 text-sm tracking-wide font-sans transition-all duration-300 ${
                            !isLogin
                              ? "text-foreground border-b-2 border-primary -mb-px"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                          onClick={() => {
                            setIsLogin(false);
                            setErrors({});
                          }}
                        >
                          Sign Up
                        </button>
                      </div>

                      {/* Google Sign In */}
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full mb-8 h-12 border-border hover:bg-muted text-foreground"
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                      >
                        <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                          <path
                            fill="currentColor"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="currentColor"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="currentColor"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          />
                          <path
                            fill="currentColor"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          />
                        </svg>
                        Continue with Google
                      </Button>

                      {/* Divider */}
                      <div className="relative mb-8">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase tracking-wider">
                          <span className="bg-card px-4 text-muted-foreground">
                            Or
                          </span>
                        </div>
                      </div>

                      {/* Form */}
                      <form onSubmit={handleSubmit} className="space-y-6">
                        {!isLogin && (
                          <div className="space-y-2">
                            <Label htmlFor="fullName" className="text-xs tracking-wider uppercase text-muted-foreground">
                              Full Name
                            </Label>
                            <div className="relative">
                              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <Input
                                id="fullName"
                                name="fullName"
                                type="text"
                                placeholder="Your name"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                className={`pl-12 h-12 bg-background border-border ${errors.fullName ? 'border-destructive' : ''}`}
                                disabled={loading}
                              />
                            </div>
                            {errors.fullName && (
                              <p className="text-xs text-destructive">{errors.fullName}</p>
                            )}
                          </div>
                        )}

                        {!isLogin && (
                          <div className="space-y-2">
                            <Label htmlFor="phone" className="text-xs tracking-wider uppercase text-muted-foreground">
                              Phone Number
                            </Label>
                            <div className="relative">
                              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <Input
                                id="phone"
                                name="phone"
                                type="tel"
                                placeholder="10-digit mobile number"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className={`pl-12 h-12 bg-background border-border ${errors.phone ? 'border-destructive' : ''}`}
                                disabled={loading}
                              />
                            </div>
                            {errors.phone && (
                              <p className="text-xs text-destructive">{errors.phone}</p>
                            )}
                          </div>
                        )}

                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-xs tracking-wider uppercase text-muted-foreground">
                            Email
                          </Label>
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              placeholder="you@example.com"
                              value={formData.email}
                              onChange={handleInputChange}
                              className={`pl-12 h-12 bg-background border-border ${errors.email ? 'border-destructive' : ''}`}
                              disabled={loading}
                            />
                          </div>
                          {errors.email && (
                            <p className="text-xs text-destructive">{errors.email}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="password" className="text-xs tracking-wider uppercase text-muted-foreground">
                            Password
                          </Label>
                          <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              id="password"
                              name="password"
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              value={formData.password}
                              onChange={handleInputChange}
                              className={`pl-12 pr-12 h-12 bg-background border-border ${errors.password ? 'border-destructive' : ''}`}
                              disabled={loading}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                          {errors.password && (
                            <p className="text-xs text-destructive">{errors.password}</p>
                          )}
                        </div>

                        <Button
                          type="submit"
                          className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 text-sm tracking-widest uppercase"
                          disabled={loading}
                        >
                          {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
                        </Button>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Auth;
