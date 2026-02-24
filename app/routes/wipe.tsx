import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";

const WipeApp = () => {
    const { auth, isLoading, error, clearError, fs, ai, kv } = usePuterStore();
    const navigate = useNavigate();
    const [files, setFiles] = useState<FSItem[]>([]);
    const [isDeleting, setIsDeleting] = useState(false);

    const loadFiles = async () => {
        const files = (await fs.readDir("./")) as FSItem[];
        setFiles(files);
    };

    useEffect(() => {
        loadFiles();
    }, []);

    useEffect(() => {
        if (!isLoading && !auth.isAuthenticated) {
            navigate("/auth?next=/wipe");
        }
    }, [isLoading]);

    const handleDelete = async () => {
        setIsDeleting(true);

        await Promise.all(
            files.map((file) => fs.delete(file.path))
        );

        await kv.flush();
        await loadFiles();

        setIsDeleting(false);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen text-lg font-medium">
                Loading...
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen text-red-500 font-medium">
                Error: {error}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            <div className="bg-white shadow-xl rounded-2xl w-full max-w-xl p-8 space-y-6">
                
                {/* Header */}
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-gray-800">
                        App Data Manager
                    </h1>
                    <p className="text-sm text-gray-500">
                        Signed in as <span className="font-medium text-gray-700">{auth.user?.username}</span>
                    </p>
                </div>

                {/* Files Section */}
                <div>
                    <h2 className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                        Existing Files
                    </h2>

                    <div className="max-h-48 overflow-y-auto border rounded-lg divide-y bg-gray-50">
                        {files.length === 0 ? (
                            <div className="p-4 text-center text-gray-400 text-sm">
                                No files found
                            </div>
                        ) : (
                            files.map((file) => (
                                <div
                                    key={file.id}
                                    className="p-3 text-sm text-gray-700 hover:bg-gray-100 transition"
                                >
                                    {file.name}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="border-t pt-4 space-y-3">
                    <h2 className="text-sm font-semibold text-red-500 uppercase tracking-wide">
                        Danger Zone
                    </h2>

                    <button
                        className="w-full bg-red-500 hover:bg-red-600 active:scale-[0.98] transition-all text-white py-2 rounded-lg font-medium shadow-md disabled:opacity-50"
                        onClick={handleDelete}
                        disabled={isDeleting || files.length === 0}
                    >
                        {isDeleting ? "Wiping..." : "Wipe App Data"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WipeApp;