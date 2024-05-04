import Text from "../basic/Text"


interface FooterSectionProps {
    heading: string,
    children?: React.ReactElement | string,
    headingClassName?: string
    className?: string
}
const FooterSection = (props: FooterSectionProps) => {
    const {heading, children, headingClassName, className} = props

    return (
        <div className={`flex flex-col text-zinc-50 ${className}`}>
            <Text className={`text-xl ${headingClassName}`}>{heading}</Text>
            <div className="mt-6">
                {children}
            </div>
        </div>
    )
}

export default FooterSection;