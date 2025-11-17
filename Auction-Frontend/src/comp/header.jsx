export default function Header({loggedIn , setShowCallModal , setShowLoginPrompt}){
    return (
        <div className="fixed top-0 left-0 w-full px-8 py-4 flex items-center justify-between ">
            <div>
                <div className="flex items-end gap-1 text-2xl font-bold text-black">
                BidWise<span>AI</span>
                </div>
                <div className="text-sm text-black/50 -mt-1">Powered by OmniDimension</div>
          </div>
        </div>
    )
}