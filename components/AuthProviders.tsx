"use client";

import { useState, useEffect } from "react";
import {getProviders, signIn} from "next-auth/react";
import Image from "next/image";
import { Button } from ".";

interface Provider {
    id: string;
    name: string;
    type: string;
    signinUrl: string;
    callbackUrl: string;
    signinUrlParams?: Record<string, string> | null
}

type Providers = Record<string, Provider>;

const AuthProviders: React.FC = () => {
    const [providers, setProviders] = useState<Providers | null>(null);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    useEffect(() => {
        const fetchProviders = async () => {
            const res = await getProviders();
            console.log(res)
            setProviders(res);
        }

        fetchProviders();
    }, [])

    if(providers) {
        return(
            <div className="relative">
                <Button 
                    title="Sign In"
                    handleClick={() => setIsOpen((prev) => !prev)}
                    type="button"
                    rightIcon={isOpen ? '/arrow-up.svg' : '/arrow-down.svg'}
                    bgColor="bg-blue-400"
                    fontStyle="font-semibold"
                />
                {isOpen && providers && (<div className="flex flex-col gap-2 absolute right-0 top-12 p-2 rounded-lg bg-blue-50">
                    <div className="text-center text-[16px] font-bold">Sign in with:</div>
                        {
                            Object.values(providers).map((provider: Provider) => (
                                <div 
                                    className="flexStart gap-4 hover:bg-gray-50 p-2 rounded-lg w-[150px]" 
                                    key={provider.name}
                                    onClick={() => signIn(provider?.id)}
                                >
                                    <Image 
                                        src={`/${provider.name}.svg`}
                                        alt={`${provider.name} icon`}
                                        width={25}
                                        height={25}
                                        className="object-contain"
                                    />
                                    <span>{provider.name}</span>
                                </div>
                            ))
                        }
                </div>)}
            </div>
        )
    }
}

export default AuthProviders;