"use client";
import { useAuthContext } from "@/components/auth/auth-provider";
import type React from "react";
import { useState, useEffect, useCallback } from "react";
import type { SignupForm, CoordinatesType } from "@/lib/form.types";
import { Role } from "@/types/auth";
import { handleFormChange, handleArrayToggle } from "@/lib/form.types";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  User,
  Building2,
  Compass,
  ArrowRight,
  ArrowLeft,
  Check,
  Loader2,
  AlertCircle,
  CheckCircle,
  X,
  AlertTriangle,
  Info,
} from "lucide-react";

const MARKET_OPTIONS = [
  // Meals
  "Jollof",
  "Fried Rice",
  "Swallow",
  "Beans",
  "Suya",
  "Chicken",
  "Beef",

  // Snacks & Drinks
  "Snacks",
  "Drinks",
  "Brews",

  // Fresh Produce
  "Fruits",
  "Veggies",
  "Spices",
  "Tubers",

  // Daily Goods
  "Clothes",
  "Shoes",
  "Deodorants",
  "Beauty",

  // Crafts & Others
  "Handmade",
  "Electronics",
  "Others",
];

// Types for response handling
type ResponseType = "success" | "error" | "warning" | "info";

interface ResponseState {
  show: boolean;
  type: ResponseType;
  title: string;
  message: string;
  autoClose?: boolean;
  duration?: number;
}

const ResponseNotification: React.FC<{
  response: ResponseState;
  onClose: () => void;
}> = ({ response, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 300);
  }, [onClose]);

  useEffect(() => {
    if (response.show) {
      setIsVisible(true);
      setIsExiting(false);

      if (response.autoClose !== false) {
        const duration =
          response.duration || (response.type === "success" ? 5000 : 7000);
        const timer = setTimeout(() => {
          handleClose();
        }, duration);

        return () => clearTimeout(timer);
      }
    }
  }, [
    response.show,
    response.autoClose,
    response.duration,
    response.type,
    handleClose,
  ]);

  if (!response.show || !isVisible) return null;

  const getIcon = () => {
    switch (response.type) {
      case "success":
        return (
          <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        );
      case "error":
        return (
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
        );
      case "warning":
        return (
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
        );
      default:
        return <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
    }
  };

  const getStyles = () => {
    const baseStyles = "backdrop-blur-sm border shadow-xl";
    switch (response.type) {
      case "success":
        return `${baseStyles} bg-emerald-50/95 dark:bg-emerald-950/95 border-emerald-200/50 dark:border-emerald-800/50`;
      case "error":
        return `${baseStyles} bg-red-50/95 dark:bg-red-950/95 border-red-200/50 dark:border-red-800/50`;
      case "warning":
        return `${baseStyles} bg-amber-50/95 dark:bg-amber-950/95 border-amber-200/50 dark:border-amber-800/50`;
      default:
        return `${baseStyles} bg-blue-50/95 dark:bg-blue-950/95 border-blue-200/50 dark:border-blue-800/50`;
    }
  };

  const getTextStyles = () => {
    switch (response.type) {
      case "success":
        return {
          title: "text-emerald-900 dark:text-emerald-100",
          message: "text-emerald-800 dark:text-emerald-200",
        };
      case "error":
        return {
          title: "text-red-900 dark:text-red-100",
          message: "text-red-800 dark:text-red-200",
        };
      case "warning":
        return {
          title: "text-amber-900 dark:text-amber-100",
          message: "text-amber-800 dark:text-amber-200",
        };
      default:
        return {
          title: "text-blue-900 dark:text-blue-100",
          message: "text-blue-800 dark:text-blue-200",
        };
    }
  };

  const textStyles = getTextStyles();

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-md transition-all duration-300 ease-out ${isExiting
        ? "animate-out fade-out-0 slide-out-to-right-2 duration-300"
        : "animate-in fade-in-0 slide-in-from-top-2 duration-500"
        }`}
    >
      <div className={`p-4 rounded-xl ${getStyles()}`}>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>
          <div className="flex-1 space-y-1 min-w-0">
            <h4
              className={`font-semibold text-sm leading-tight ${textStyles.title}`}
            >
              {response.title}
            </h4>
            <p className={`text-sm leading-relaxed ${textStyles.message}`}>
              {response.message}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="flex-shrink-0 h-6 w-6 p-0 hover:bg-black/5 dark:hover:bg-white/5 rounded-md transition-colors"
          >
            <X className="w-4 h-4 opacity-70 hover:opacity-100 transition-opacity" />
          </Button>
        </div>

        {/* Progress bar for auto-close */}
        {response.autoClose !== false && (
          <div className="mt-3 h-1 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ease-linear ${response.type === "success"
                ? "bg-emerald-500"
                : response.type === "error"
                  ? "bg-red-500"
                  : response.type === "warning"
                    ? "bg-amber-500"
                    : "bg-blue-500"
                }`}
              style={{
                animation: `shrink ${response.duration ||
                  (response.type === "success" ? 5000 : 7000)
                  }ms linear forwards`,
              }}
            />
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
};

// Progress bar component
const ProgressBar: React.FC<{ stage: number; totalStages: number }> = ({
  stage,
  totalStages,
}) => {
  const progress = ((stage + 1) / totalStages) * 100;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        {Array.from({ length: totalStages }, (_, i) => (
          <div
            key={i}
            className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-all duration-300 ${i <= stage
              ? "bg-primary text-primary-foreground shadow-lg"
              : "bg-muted text-muted-foreground"
              }`}
          >
            {i < stage ? <Check className="w-4 h-4" /> : i + 1}
          </div>
        ))}
      </div>
      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

// Navigation buttons component
const NavigationButtons: React.FC<{
  stage: number;
  onBack: () => void;
  onNext?: () => void;
  onSubmit?: () => void;
  isLastStage: boolean;
  isSubmitting: boolean;
  canProceed: boolean;
}> = ({
  stage,
  onBack,
  onNext,
  onSubmit,
  isLastStage,
  isSubmitting,
  canProceed,
}) => {
    return (
      <div className="flex gap-3">
        {stage > 0 && (
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="flex-1 h-12 group bg-transparent"
            disabled={isSubmitting}
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back
          </Button>
        )}

        {isLastStage ? (
          <Button
            type="button"
            onClick={onSubmit}
            className="flex-1 h-12 text-base font-medium bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg"
            disabled={!canProceed || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        ) : (
          <Button
            type="button"
            onClick={onNext}
            className="flex-1 h-12 group"
            disabled={!canProceed}
          >
            Continue
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        )}
      </div>
    );
  };

// User type selection component
const UserTypeSelection: React.FC<{
  userType: "user" | "vendor";
  onUserTypeChange: (type: "user" | "vendor") => void;
}> = ({ userType, onUserTypeChange }) => {
  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      <div className="text-center space-y-2">
        <CardTitle className="text-2xl font-bold">Choose Your Path</CardTitle>
        <CardDescription className="text-base">
          Are you here to explore the market or showcase your offerings?
        </CardDescription>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <UserTypeCard
          type="user"
          icon={<User className="w-6 h-6" />}
          title="Market Explorer"
          description="Discover stalls, products, and experiences near you"
          isSelected={userType === "user"}
          onClick={() => onUserTypeChange("user")}
        />
        <UserTypeCard
          type="vendor"
          icon={<Building2 className="w-6 h-6" />}
          title="Market Vendor"
          description="Showcase your products and reach more customers"
          isSelected={userType === "vendor"}
          onClick={() => onUserTypeChange("vendor")}
        />
      </div>
    </div>
  );
};

// User type card component
const UserTypeCard: React.FC<{
  type: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
}> = ({ icon, title, description, isSelected, onClick }) => {
  return (
    <button
      type="button"
      className={`group relative p-6 rounded-xl border-2 transition-all duration-300 text-left ${isSelected
        ? "border-primary bg-primary/5 shadow-lg"
        : "border-border hover:border-primary/50 hover:bg-muted/50"
        }`}
      onClick={onClick}
    >
      <div className="flex items-center space-x-4">
        <div
          className={`p-3 rounded-lg transition-colors ${isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
            }`}
        >
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
      </div>
    </button>
  );
};

// Account details stage component
const AccountDetailsStage: React.FC<{
  form: SignupForm;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ form, onChange }) => {
  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      <div className="text-center space-y-2">
        <CardTitle className="text-2xl font-bold">Account Details</CardTitle>
        <CardDescription className="text-base">
          Let&apos;s get you set up with your personal information
        </CardDescription>
      </div>

      <div className="space-y-4">
        <FormField
          label="Full Name"
          name="name"
          placeholder="Enter your full name"
          value={form.name}
          onChange={onChange}
          required
        />
        <FormField
          label="Email Address"
          name="email"
          type="email"
          placeholder="Enter your email address"
          value={form.email}
          onChange={onChange}
          required
        />
        <FormField
          label="Password"
          name="password"
          type="password"
          placeholder="Create a secure password"
          value={form.password}
          onChange={onChange}
          required
        />
      </div>
    </div>
  );
};

// Form field component
const FormField: React.FC<{
  label: string;
  name: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}> = ({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
}) => {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <Input
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="h-12 text-base"
          required={required}
        />
      </div>
    );
  };

// Preferences stage component
const PreferencesStage: React.FC<{
  form: SignupForm;
  onPrefChange: (pref: string) => void;
}> = ({ form, onPrefChange }) => {
  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center mb-2">
          <Compass className="w-8 h-8 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold">Your Preferences</CardTitle>
        <CardDescription className="text-base">
          Help us personalize your MarketRadar discovery experience
        </CardDescription>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {MARKET_OPTIONS.map((option) => (
            <PreferenceCard
              key={option}
              meal={option}
              isSelected={form.mealPrefs.includes(option)}
              onToggle={onPrefChange}
            />
          ))}
        </div>

        {form.mealPrefs.length > 0 && (
          <SelectedPreferences preferences={form.mealPrefs} />
        )}
      </div>
    </div>
  );
};


// Preference card component
const PreferenceCard: React.FC<{
  meal: string;
  isSelected: boolean;
  onToggle: (meal: string) => void;
}> = ({ meal, isSelected, onToggle }) => {
  return (
    <label
      className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${isSelected
        ? "border-primary bg-primary/5 shadow-sm"
        : "border-border hover:border-primary/50 hover:bg-muted/50"
        }`}
    >
      <Checkbox
        checked={isSelected}
        onCheckedChange={() => onToggle(meal)}
        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
      />
      <span className="font-medium text-sm">{meal}</span>
    </label>
  );
};

// Selected preferences display component
const SelectedPreferences: React.FC<{ preferences: string[] }> = ({
  preferences,
}) => {
  return (
    <div className="p-4 bg-muted/50 rounded-lg">
      <p className="text-sm font-medium mb-2">Selected preferences:</p>
      <div className="flex flex-wrap gap-2">
        {preferences.map((pref) => (
          <Badge key={pref} variant="secondary" className="text-xs">
            {pref}
          </Badge>
        ))}
      </div>
    </div>
  );
};

// Vendor details stage component
const VendorDetailsStage: React.FC<{
  form: SignupForm;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ form, onChange }) => {
  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center mb-2">
          <Building2 className="w-8 h-8 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold">Vendor Details</CardTitle>
        <CardDescription className="text-base">
          Tell us about your business
        </CardDescription>
      </div>

      <div className="space-y-4">
        <FormField
          label="Business Name"
          name="vendorName"
          placeholder="Enter your business name"
          value={form.vendorName}
          onChange={onChange}
          required
        />
        <FormField
          label="Business Description"
          name="vendorDesc"
          placeholder="Describe your offerings"
          value={form.vendorDesc}
          onChange={onChange}
          required
        />
      </div>
    </div>
  );
};

// Location stage component
const LocationStage: React.FC<{
  form: SignupForm;
  coordinates: CoordinatesType;
  locationLoading: boolean;
  locError: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGetCoordinates: () => void;
}> = ({
  form,
  coordinates,
  locationLoading,
  locError,
  onChange,
  onGetCoordinates,
}) => {
    return (
      <div className="space-y-6 animate-in fade-in-50 duration-500">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center mb-2">
            <MapPin className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Complete Your Location Profile</CardTitle>
          <CardDescription className="text-base">
            Provide your location details so the community can find and connect with you effectively
          </CardDescription>
        </div>

        <div className="space-y-4">

          <FormField
            label="Area / Neighborhood"
            name="area"
            placeholder="e.g. Lekki Phase 1, Gwarinpa"
            value={form.area}
            onChange={onChange}
            required
          />
          <FormField
            label="Closest Landmark"
            name="landmark"
            placeholder="e.g. Near Shoprite Ikeja, Opposite First Bank"
            value={form.landmark}
            onChange={onChange}
            required
          />
          <FormField
            label="City"
            name="city"
            placeholder="e.g. Lagos"
            value={form.city}
            onChange={onChange}
            required
          />
          <FormField
            label="State"
            name="state"
            placeholder="e.g. Lagos State"
            value={form.state}
            onChange={onChange}
            required
          />

          <LocationSharing
            coordinates={coordinates}
            loading={locationLoading}
            error={locError}
            onGetCoordinates={onGetCoordinates}
          />
        </div>
      </div>
    );
  };

// Location sharing component
const LocationSharing: React.FC<{
  coordinates: CoordinatesType;
  loading: boolean;
  error: string;
  onGetCoordinates: () => void;
}> = ({ coordinates, loading, error, onGetCoordinates }) => {
  return (
    <div className="border-2 border-primary/30 rounded-lg p-4 bg-primary/5 space-y-4">
      <div>
        <div className="flex items-start justify-between mb-2">
          <div>
            <h4 className="font-semibold text-base text-foreground">
              Device Location
              <span className="text-red-500 ml-1">*</span>
            </h4>
            <p className="text-sm text-muted-foreground mt-1">
              Enable location access to share your precise GPS coordinates. This is required to complete your signup.
            </p>
          </div>
        </div>
      </div>

      <Button
        type="button"
        onClick={onGetCoordinates}
        variant={coordinates ? "outline" : "default"}
        size="lg"
        className={`w-full h-12 font-medium transition-all ${coordinates
          ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-100"
          : ""
          }`}
        disabled={!!coordinates || loading}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Getting Your Location...
          </>
        ) : coordinates ? (
          <>
            <Check className="w-4 h-4 mr-2 text-emerald-600 dark:text-emerald-400" />
            Location Verified
          </>
        ) : (
          <>
            <MapPin className="w-4 h-4 mr-2" />
            Share My Device Location
          </>
        )}
      </Button>

      {coordinates && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-700 rounded-lg">
          <div className="flex items-start gap-3">
            <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-emerald-900 dark:text-emerald-100 mb-2">
                Location Successfully Verified
              </p>
              <div className="text-xs text-emerald-800 dark:text-emerald-200 space-y-1 font-mono bg-white/50 dark:bg-black/20 p-2 rounded">
                <div><span className="font-semibold">Latitude:</span> {coordinates.latitude.toFixed(6)}</div>
                <div><span className="font-semibold">Longitude:</span> {coordinates.longitude.toFixed(6)}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-900 dark:text-amber-100 mb-1">
                Unable to Access Location
              </p>
              <p className="text-sm text-amber-800 dark:text-amber-200">{error}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Geolocation utility function
async function getDeviceCoordinates(
  setCoordinates: React.Dispatch<React.SetStateAction<CoordinatesType>>,
  setError: React.Dispatch<React.SetStateAction<string>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) {
  setLoading(true);
  setError("");

  if (!navigator.geolocation) {
    setError("Geolocation is not supported by your browser.");
    setLoading(false);
    return;
  }

  // Strategy 1: Quick approximate location first (for immediate feedback)
  const getApproximateLocation = () => {
    return new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        resolve,
        reject,
        {
          enableHighAccuracy: false,
          timeout: 3000,
          maximumAge: 30000, // Accept 30-second cached position
        }
      );
    });
  };

  // Strategy 2: Precise GPS location
  const getPreciseLocation = () => {
    return new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        resolve,
        reject,
        {
          enableHighAccuracy: true,
          timeout: 30000, // Extended timeout for GPS lock
          maximumAge: 0, // Force fresh reading
        }
      );
    });
  };

  try {
    // First, try to get approximate location quickly (optional - for UX)
    try {
      const approxPos = await getApproximateLocation();
      const { latitude, longitude } = approxPos.coords;

      // Set approximate coordinates immediately for better UX
      setCoordinates({ latitude, longitude });
      console.log("Got approximate location, fetching precise...");
    } catch (approxError) {
      console.log("No approximate location available, waiting for GPS...");
    }

    // Then get precise GPS location
    const precisePos = await getPreciseLocation();
    const { latitude, longitude, accuracy } = precisePos.coords;

    // Update with precise coordinates
    setCoordinates({ latitude, longitude });
    setLoading(false);

    console.log(`Got precise location with accuracy: ${accuracy}m`);

  } catch (error: any) {
    setLoading(false);

    const errorMessages: Record<number, string> = {
      1: "Location access denied. Please enable location permissions in your device settings and try again.",
      2: "Unable to determine your location. Please ensure location services are enabled, move near a window, or try again.",
      3: "Location request timed out. This often happens indoors. Please move to an area with better GPS signal and try again.",
    };

    const errorMsg = errorMessages[error.code] ||
      "Unable to get your precise location. Please ensure location services are enabled.";

    setError(errorMsg);
    console.error("Geolocation error:", error.code, error.message);
  }
}

// Main component
const MultiStageSignupForm: React.FC = () => {
  const { register, isLoading } = useAuthContext();

  // Form state
  const [stage, setStage] = useState<number>(0);
  const [userType, setUserType] = useState<"user" | "vendor">("user");
  const [form, setForm] = useState<SignupForm>({
    name: "",
    email: "",
    password: "",
    vendorName: "",
    vendorDesc: "",
    mealPrefs: [],
    address: "",
    area: "",
    city: "",
    state: "",
    landmark: "",
  });

  // Location state
  const [coordinates, setCoordinates] = useState<CoordinatesType>(null);
  const [locError, setLocError] = useState<string>("");
  const [locationLoading, setLocationLoading] = useState<boolean>(false);

  const [response, setResponse] = useState<ResponseState>({
    show: false,
    type: "info",
    title: "",
    message: "",
    autoClose: true,
    duration: 5000,
  });

  const totalStages = 4;

  // Event handlers
  const handleNext = () => setStage((s: number) => s + 1);
  const handleBack = () => setStage((s: number) => s - 1);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFormChange(form, setForm, e);
  };
  const handleMealPref = (meal: string) => {
    setForm((prev: SignupForm) => ({
      ...prev,
      mealPrefs: handleArrayToggle(prev.mealPrefs, meal),
    }));
  };
  const handleGetCoordinates = () => {
    getDeviceCoordinates(setCoordinates, setLocError, setLocationLoading);
  };

  const showResponse = (
    type: ResponseType,
    title: string,
    message: string,
    options?: { autoClose?: boolean; duration?: number }
  ) => {
    setResponse({
      show: true,
      type,
      title,
      message,
      autoClose: options?.autoClose ?? true,
      duration:
        options?.duration ??
        (type === "success" ? 5000 : type === "error" ? 8000 : 6000),
    });
  };

  const closeResponse = () => {
    setResponse((prev) => ({ ...prev, show: false }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: userType === "vendor" ? Role.VENDOR : Role.USER,
        vendorName: form.vendorName,
        vendorDescription: form.vendorDesc,
        latitude: coordinates?.latitude,
        longitude: coordinates?.longitude,
        address: form.address,
        area: form.area,
        city: form.city,
        state: form.state,
        landmark: form.landmark,
        mealPreferences: form.mealPrefs,
      };

      const result = await register(payload);

      if (result.success) {
        showResponse(
          "success",
          "Welcome aboard! 🎉",
          "Your account has been created successfully. Please check your email to verify your account before signing in.",
          { duration: 6000 }
        );

      } else {
        // Handle different types of errors with appropriate messaging
        const errorTitle = result.message?.includes("email")
          ? "Email Already Exists"
          : result.message?.includes("password")
            ? "Password Requirements Not Met"
            : "Registration Failed";

        showResponse(
          "error",
          errorTitle,
          result.message ||
          "Unable to create your account. Please check your information and try again.",
          { duration: 10000 }
        );
      }
    } catch (err) {
      console.error("Registration error:", err);
      showResponse(
        "error",
        "Something Went Wrong",
        "An unexpected error occurred during registration. Please check your connection and try again.",
        { duration: 8000 }
      );
    }
  };

  // Validation helpers
  const canProceedFromStage = (currentStage: number): boolean => {
    switch (currentStage) {
      case 0:
        return true; // User type is always selected
      case 1:
        return !!(
          form.name.trim() &&
          form.email.trim() &&
          form.password.trim()
        );
      case 2:
        return userType === "vendor"
          ? !!(form.vendorName.trim() && form.vendorDesc.trim())
          : true;
      case 3:
        // Location stage: all address fields AND coordinates are required
        return !!(
          form.area.trim() &&
          form.city.trim() &&
          form.state.trim() &&
          coordinates // This ensures location has been shared
        );
      default:
        return false;
    }
  };

  const renderStage = () => {
    switch (stage) {
      case 0:
        return (
          <UserTypeSelection
            userType={userType}
            onUserTypeChange={setUserType}
          />
        );
      case 1:
        return <AccountDetailsStage form={form} onChange={handleChange} />;
      case 2:
        return userType === "user" ? (
          <PreferencesStage form={form} onPrefChange={handleMealPref} />
        ) : (
          <VendorDetailsStage form={form} onChange={handleChange} />
        );
      case 3:
        return (
          <LocationStage
            form={form}
            coordinates={coordinates}
            locationLoading={locationLoading}
            locError={locError}
            onChange={handleChange}
            onGetCoordinates={handleGetCoordinates}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="space-y-8">
        <ProgressBar stage={stage} totalStages={totalStages} />

        <div className="space-y-6">
          {renderStage()}

          <NavigationButtons
            stage={stage}
            onBack={handleBack}
            onNext={handleNext}
            onSubmit={handleSubmit}
            isLastStage={stage === 3}
            isSubmitting={isLoading}
            canProceed={canProceedFromStage(stage)}
          />
        </div>
      </div>

      <ResponseNotification response={response} onClose={closeResponse} />
    </>
  );
};

export default MultiStageSignupForm;
