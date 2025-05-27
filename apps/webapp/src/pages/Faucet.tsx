import { useId, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useBalance } from 'wagmi'
import { formatEther } from 'viem'

import type { ChangeEvent} from 'react'
import type { Address } from 'viem'

import { chainMetadataByChainId } from '../libs'
import type { ChainMetadata } from '../libs'

import SokushuuLogo from '../assets/sokushuu.png';
import SocialGithubLogo from '../assets/social-github.svg'
import SocialTelegramLogo from '../assets/social-telegram.svg'
import SocialXLogo from '../assets/social-x.svg'

const listChainMetadata: ChainMetadata[] = Object.values(chainMetadataByChainId);

const Faucet = () => {
    const queryClient = useQueryClient();
    const selectChainId = useId();
    const publicWalletAddressId = useId();
    const [selectedChain, setSelectedChain] = useState<ChainMetadata>(listChainMetadata[0]);
    const [chainSelectionIsShown, setChainSelectionIsShown] = useState<boolean>(true);
    const [userAddress, setUserAddress] = useState<Address>();
    const [message, setMessage] = useState<string>();
    const [txHash, setTxHash] = useState<string>();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const {
        data: userBalance,
        isFetched: userBalanceIsFetched,
        queryKey: userBalanceQueryKey,
    } = useBalance({
        chainId: selectedChain?.id,
        address: userAddress,
    })
    const {
        data: faucetBalance,
        isFetched: faucetBalanceIsFetched,
        queryKey: faucetBalanceQueryKey,
    } = useBalance({
        chainId: selectedChain?.id,
        address: import.meta.env.VITE_FAUCET_PUBLIC_ADDRESS,
    })

    const handleChainSelection = (event: ChangeEvent<HTMLSelectElement>) => {
        setUserAddress(undefined);
        const chainId = parseInt(event.target.value);
        setSelectedChain(chainMetadataByChainId[chainId]);
    }

    const closeChainSelection = () => {
        if (selectedChain?.id === 0) return;

        setChainSelectionIsShown(false);
    }

    const openChainSelection = () => {
        setChainSelectionIsShown(true);
    }

    const handleSubmit = async () => {
        setMessage(undefined);
        setTxHash(undefined);

        if (!/^0x[a-fA-F0-9]{40}$/.test(userAddress ?? '')) {
            setMessage("Address format is not valid");
            return;
        }

        setIsSubmitting(true);

        try {
            const result = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URI}/faucet/${selectedChain.id}`, {
                method: 'POST',
                body: JSON.stringify({
                    address: userAddress
                })
            })
            const resultBody = await result.json();

            if (!resultBody.ok || !resultBody.hash) {
                setIsSubmitting(false);
                setMessage(resultBody.message);
                return;
            }

            setIsSubmitting(false);
            setTxHash(resultBody.hash);

            queryClient.invalidateQueries({ queryKey: userBalanceQueryKey });
            queryClient.invalidateQueries({ queryKey: faucetBalanceQueryKey });
        } catch (err: any) {
            setIsSubmitting(false);
            setMessage('Something is wrong with the server, please try again');
        }
    }

    return (
        <div className="p-4 flex flex-col min-h-screen justify-between">
            <div className="flex flex-col gap-y-8">
                <div className="flex justify-start">
                    <img
                        className="w-12 h-12"
                        src={SokushuuLogo}
                        alt="Sokushuu Logo"
                    />
                    <p className="text-xl flex items-center">Sokushuu Faucet</p>
                </div>
                <div className="lg:w-120 p-2 lg:mx-auto">
                    { chainSelectionIsShown && <div className="p-2 border-2 border-zinc-600 rounded-md flex flex-col gap-y-2">
                        <label htmlFor={selectChainId}>
                            Select Chain:
                        </label>
                        <select
                            className="p-2 w-full border-2 border-zinc-600 rounded-md active:border-zinc-800"
                            onChange={handleChainSelection}
                            value={selectedChain?.id}
                            id={selectChainId}
                        >
                            {listChainMetadata.map(
                                (chain) => <option key={chain.id} value={chain.id} className="">{chain.name}</option>
                            )}
                        </select>
                        <button
                            onClick={closeChainSelection}
                            disabled={selectedChain?.id === 0}
                            className={`${selectedChain?.id !== 0 ? 'bg-zinc-100 cursor-pointer' : 'bg-zinc-200'} border-2 border-zinc-600 p-1 rounded-md`}
                        >
                            Save
                        </button>
                    </div>
                    }
                    { !chainSelectionIsShown && <div className="flex flex-col gap-y-4 border-2 border-zinc-600 rounded-md p-4">
                        <div className="w-full flex justify-between">
                            <div className="flex items-center gap-x-2">
                                <img
                                    className="w-8 h-8 rounded-full"
                                    src={selectedChain?.icon}
                                    alt="chain logo"
                                />
                                <p className="text-lg">{selectedChain?.name}</p>
                            </div>
                            <button
                                onClick={openChainSelection}
                                className="bg-zinc-100 border-2 border-zinc-600 px-2 py-1 rounded-md my-auto cursor-pointer"
                            >
                                Change
                            </button>
                        </div>
                        <label>Faucet Public Address</label>
                        <input
                            type="text"
                            className="p-2 border-2 border-zinc-600 rounded-md"
                            value={import.meta.env.VITE_FAUCET_PUBLIC_ADDRESS}
                            disabled
                        />
                        { faucetBalanceIsFetched && <p className="flex justify-between">
                                <span>Faucet Balance:</span> <span>{formatEther(faucetBalance?.value ?? BigInt(0))} {faucetBalance?.symbol}</span>
                            </p>
                        }

                        <label htmlFor={publicWalletAddressId}>Wallet Public Address</label>
                        <input
                            id={publicWalletAddressId}
                            onChange={(e) => setUserAddress(e.currentTarget.value as Address)}
                            type="text"
                            className="p-2 border-2 border-zinc-600 rounded-md"
                            placeholder="0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
                        />
                        { userBalanceIsFetched && <p className="flex justify-between">
                                <span>Your Balance:</span> <span>{formatEther(userBalance?.value ?? BigInt(0))} {userBalance?.symbol}</span>
                            </p>
                        }
                        <button
                            onClick={handleSubmit}
                            disabled={!!txHash}
                            className={`border-2 border-zinc-600 rounded-md ${!!txHash && 'bg-zinc-300'} p-1 cursor-pointer`}
                        >
                            { isSubmitting ? 'Claiming...' : txHash ? 'Claimed' : 'Claim' }
                        </button>
                        { txHash && <div className="flex justify-between">
                                <p>Tx Hash:</p>
                                <a
                                    className="underline text-blue-600"
                                    href={`${selectedChain.blockExplorerURI}/tx/${txHash}`}
                                    target="_blank"
                                >
                                    {txHash.slice(0, 6)}...{txHash.slice(-6)}
                                </a>
                            </div>
                        }
                        <p>{message}</p>
                    </div>
                    }
                </div>
            </div>
            <div className="px-4 mt-4 flex justify-end">
                <a
                    href="https://x.com/sokushuu_de"
                    target="_blank"
                    className="p-2 border-2 border-transparent hover:border-zinc-600 rounded-md cursor-pointer"
                >
                    <img
                        className="w-5 h-5"
                        src={SocialXLogo}
                        alt="X Social Media Icon"
                    />
                </a>
                <a
                    href="https://t.me/sokushuu"
                    target="_blank"
                    className="p-2 border-2 border-transparent hover:border-zinc-600 rounded-md cursor-pointer"
                >
                    <img
                        className="w-5 h-5"
                        src={SocialTelegramLogo}
                        alt="Telegram Social Media Icon"
                    />
                </a>
                <a
                    href="https://github.com/Sokushuu"
                    target="_blank"
                    className="p-2 border-2 border-transparent hover:border-zinc-600 rounded-md cursor-pointer"
                >
                    <img
                        className="w-5 h-5"
                        src={SocialGithubLogo}
                        alt="Github Social Media Icon"
                    />
                </a>
            </div>
        </div>
    );
}

export default Faucet;