import { Button, ButtonProps, ButtonTypeMap } from "@mui/joy";

interface Props
    extends ButtonProps<
        ButtonTypeMap["defaultComponent"],
        {
            component?: React.ElementType;
        }
    > {}

export default function ChoiceButton(props: Props) {
    const { sx, ...rest } = props;

    return <Button size='sm' {...rest} />;
}
