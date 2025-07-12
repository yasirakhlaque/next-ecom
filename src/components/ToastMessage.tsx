interface ToastMessageProps {
    heading: string;
    info: string;
}
export default function ToastMessage({ heading, info }: ToastMessageProps) {
    return (
        <div className="bg-white/30 backdrop-blur-xl text-left border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm w-full pr-20 fadeIn">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Added to {heading}</h2>
            <p className="text-gray-800 text-sm">{info} has been added to {heading}</p>
        </div>
    );
}