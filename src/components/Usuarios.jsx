import { UserIcon } from "@heroicons/react/24/outline";
import { Card, Flex, Icon, Title, Text } from "@tremor/react";

const User = (props) =>{
    return(
        <div className="w-full relative group">
            <div className="absolute inset-0.5 bg-main rounded-lg blur opacity-0 group-hover:opacity-75 transition-opacity"></div>
            <Card className="w-full overflow-hidden !p-4">
                <Flex className="space-x-2 flex-col lg:flex-row relative">
                    <Icon 
                        icon={ UserIcon }
                        size="xl"
                        variant="light"
                        color="red"
                    />
                    <div className="w-full my-2">
                        <div className="flex items-center gap-2">
                            <Title className="!text-sm">Nombre:</Title>
                            <Text>{ props.User.nombre }</Text>
                        </div>
                        <div className="flex items-center gap-2">
                            <Title className="!text-sm">Cargo:</Title>
                            <Text>{ props.User.cargo }</Text>
                        </div>
                        <div className="flex items-center gap-2">
                            <Title className="!text-sm">Email:</Title>
                            <Text>{ props.User.email }</Text>
                        </div>
                    </div>
                </Flex>
            </Card>
        </div>
    )
}

export default User;