type CardProps = {
    name: string;
    number: string | number;
    initials: string;
    label?: string;
}

export const Card = (props: CardProps) => {
    return (
        <div className="flex aspect-square w-full max-w-64 flex-col justify-between rounded-xl border border-[#f0cf86]/14 bg-[#571120] p-6 font-serif shadow-[0_20px_45px_-30px_rgba(0,0,0,0.75)]">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#f0cf86]/30 bg-[#300811] text-center">
                <h1 className="text-[#f0cf86]">{props.initials}</h1>
            </div>
            <h1 className="text-lg leading-7 text-[#fff8ee] break-words">{props.name}</h1>
            <h1 className="text-[#f0cf86]">{props.number} {props.label ?? "Members"}</h1>
        </div>
    );
}

export default Card;
