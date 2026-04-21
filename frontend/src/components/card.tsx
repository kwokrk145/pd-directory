type CardProps = {
    name: string;
    number: string;
    initials: string;
    label?: string;
}

export const Card = (props: CardProps) => {
    return (
        <div className="flex min-h-60 w-full max-w-60 flex-col justify-center gap-2 rounded-xl border border-[#f0cf86]/14 bg-[#571120] px-8 py-6 font-serif shadow-[0_20px_45px_-30px_rgba(0,0,0,0.75)]">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#f0cf86]/30 bg-[#300811] text-center">
                <h1 className="text-[#f0cf86]">{props.initials}</h1>
            </div>
            <h1 className="text-[#fff8ee] break-words leading-7">{props.name}</h1>
            <h1 className="text-[#f0cf86]">{props.number} {props.label ?? "Members"}</h1>
        </div>
    );
}

export default Card;
