import { FaPencil } from "react-icons/fa6";
import { IoLocationOutline } from "react-icons/io5";

export default function ProfilePage() {
    return (
        <div className="min-h-screen m-10">
            <h1 className="text-3xl font-semibold text-gray-800" style={{ fontFamily: 'var(--font-playfair)' }}>Profile Information</h1>
            <div className="flex justify-center gap-4 p-6">
                <div className="flex flex-col items-center justify-center gap-4 bg-white/30 backdrop-blur-xl rounded-lg shadow-lg p-6 border-1 border-white w-1/3 h-60">
                    <div className="h-30 w-30">
                        <img src="https://i.pinimg.com/736x/48/b8/10/48b8101bf681dca624173b045c67047d.jpg" alt="user image" className="h-[100%] w-[100%] object-cover rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600" />
                    </div>
                    <h1 className="text-xl font-semibold text-gray-700" style={{ fontFamily: 'var(--font-playfair)' }}>Jhon Doe</h1>
                </div>
                <div className="flex flex-col w-2/3 justify-center items-center gap-4">
                    <div className="bg-white/30 border-1 border-white backdrop-blur-xl rounded-lg shadow-lg p-6 flex flex-col gap-4 w-full">
                        <h1 className="text-2xl font-semibold text-gray-700" style={{ fontFamily: 'var(--font-playfair)' }}>Personal Information</h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <label htmlFor="name" className="text-sm font-semibold">First Name</label>
                                <input type="text" name="name" id="name" value={"Jhon"} disabled className="bg-white/30 border-1 border-white px-4 py-3 rounded-lg" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="name" className="text-sm font-semibold">Last Name</label>
                                <input type="text" name="name" id="name" value={"Doe"} disabled className="bg-white/30 border-1 border-white px-4 py-3 rounded-lg" />
                            </div>
                            <div className="flex flex-col gap-2 md:col-span-2">
                                <label htmlFor="email" className="text-sm font-semibold">Email</label>
                                <input type="email" name="email" id="email" value={"jhondoe@example.com"} disabled className="bg-white/30 border-1 border-white px-4 py-3 rounded-lg" />
                            </div>
                            <div className="flex flex-col gap-2 md:col-span-2">
                                <label htmlFor="phone" className="text-sm font-semibold">Phone</label>
                                <input type="text" name="phone" id="phone" value={"+1 (555) 123-456-78"} disabled className="bg-white/30 border-1 border-white px-4 py-3 rounded-lg" />
                            </div>
                        </div>
                        <button className="flex justify-center items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 text-sm text-white hover:from-indigo-700 hover:to-purple-700">Edit Profile<FaPencil /></button>
                    </div>
                    <div className="bg-white/30 border-1 border-white backdrop-blur-xl rounded-lg shadow-lg p-6 flex flex-col gap-4 w-full">
                        <div className="flex items-center gap-4">
                            <IoLocationOutline size={24} className="text-indigo-500" /> <h1 className="text-2xl font-semibold text-gray-700" style={{ fontFamily: 'var(--font-playfair)' }}>Shipping Address</h1>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="flex justify-center flex-col bg-white/30 border-1 border-white px-4 py-3 rounded-lg">
                                <h4>John Doe</h4>
                                <h4> 123 Main Street</h4>
                                <h4>New York, NY 10001</h4>
                                <h4> United States</h4>
                            </div>
                            <button className="flex justify-center items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-tr from-gray-500 to-gray-600 text-sm text-white hover:from-gray-700 hover:to-gray-800">Edit Address<FaPencil /></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}