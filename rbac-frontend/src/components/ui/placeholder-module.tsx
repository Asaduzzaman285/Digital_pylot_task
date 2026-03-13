export default function PlaceholderPage({ title }: { title: string }) {
    return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-4 rounded-2xl border-2 border-dashed border-gray-200 bg-white p-12 text-center">
            <div className="rounded-full bg-obliq-surface p-4 text-obliq-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            </div>
            <div>
                <h2 className="text-xl font-bold text-obliq-primary">{title} Module</h2>
                <p className="text-obliq-secondary max-w-xs mx-auto"> This module is currently under development as part of the Phase 7 integration. </p>
            </div>
        </div>
    );
}
