import { userData } from "@/types/types";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { FaRegSave } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";

export default function EditAddressForm({ userData, setEditForm, onUpdate }: { userData: userData | null; setEditForm: (value: boolean) => void; onUpdate: () => void }) {
    const { data: session } = useSession();
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        street: "",
        city: "",
        state: "",
        zip: "",
        country: ""
    });

    useEffect(() => {
        const userAddress = userData?.address || "123 Main Street, New York, NY, 10001, United States";
        const formatAddress = (address: string) => {
            const parts = address.split(', ');
            return {
                street: parts[0] || "",
                city: parts[1] || "",
                state: parts[2] || "",
                zip: parts[3] || "",
                country: parts[4] || ""
            };
        };
        const addressParts = formatAddress(userAddress);
        setFormData({
            street: addressParts.street,
            city: addressParts.city,
            state: addressParts.state,
            zip: addressParts.zip,
            country: addressParts.country
        });
    }, [userData]);

    useEffect(() => {
        if (errorMessage || successMessage) {
            setErrorMessage("");
            setSuccessMessage("");
        }
    }, [formData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        if (!formData.street || !formData.city || !formData.state || !formData.zip || !formData.country) {
            setErrorMessage("All fields are required.");
            return;
        }
        try {
            const response = await fetch(`/api/user/${session?.user?.id}/address`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                const errorMsg = data?.error || `Something went wrong (${response.status})`;
                setErrorMessage(errorMsg);
                return;
            }

            setSuccessMessage("Address updated successfully! 🎉");
        } catch (err) {
            console.error("Network or unexpected error:", err);
            setErrorMessage("Network error or unexpected issue occurred.");
        } finally {
            setSubmitting(false);
            setTimeout(() => {
                setEditForm(false);
                onUpdate();
            }, 2000);
        }
    };


    return (
        <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md relative">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Edit Address</h3>
                <h2 className="text-lg font-semibold text-gray-800 mb-4 absolute top-6 right-4 cursor-pointer"
                    onClick={() => setEditForm(false)}>
                    <RxCross2 />
                </h2>
                <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
                    {successMessage && (
                        <p className="text-green-600 bg-green-200 border border-green-600 mb-2 col-span-2 p-2">{successMessage}</p>
                    )}
                    {errorMessage && (
                        <p className="text-red-600 bg-red-200 border border-red-600 mb-2 col-span-2 p-2">{errorMessage}</p>
                    )}
                    <div className="flex flex-col gap-4 text-sm col-span-2">
                        <label htmlFor="street" className="font-semibold">Street Address</label>
                        <input type="text" name="street" id="street"
                            value={formData.street}
                            onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                            className="py-4 px-3 rounded-lg border border-gray-500" />
                    </div>
                    <div className="flex flex-col gap-4 text-sm">
                        <label htmlFor="city" className="font-semibold">City</label>
                        <input type="text" name="city" id="city"
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            className="py-4 px-3 rounded-lg border border-gray-500" />
                    </div>
                    <div className="flex flex-col gap-4 text-sm">
                        <label htmlFor="state" className="font-semibold">State</label>
                        <input type="text" name="state" id="state"
                            value={formData.state}
                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                            className="py-4 px-3 rounded-lg border border-gray-500" />
                    </div>
                    <div className="flex flex-col gap-4 text-sm">
                        <label htmlFor="zipCode" className="font-semibold">Zip Code</label>
                        <input type="text" name="zipCode" id="zipCode"
                            value={formData.zip}
                            onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                            className="py-4 px-3 rounded-lg border border-gray-500" />
                    </div>
                    <div className="flex flex-col gap-4 text-sm">
                        <label htmlFor="country" className="font-semibold">Country</label>
                        <input type="text" name="country" id="country"
                            value={formData.country}
                            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                            className="py-4 px-3 rounded-lg border border-gray-500" />
                    </div>
                    <div className="flex items-center justify-end gap-4 text-sm col-span-2">
                        <button onClick={() => setEditForm(false)} className="px-8 py-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">Close</button>
                        <button type="submit"
                            className="flex gap-4 justify-center items-center py-4 px-10 rounded-lg text-white bg-gradient-to-tr from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 transition-colors"
                            disabled={submitting}
                        ><FaRegSave />{submitting ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}