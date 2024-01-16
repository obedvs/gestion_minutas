
const Loading = () => {

    return (
        <section className='absolute right-1/2 top-1/2'>

            <div
                className='h-8 w-8 animate-spin rounded-full border-4 border-solid border-main border-r-transparent align-[-0.125em] text-black motion-reduce:animate-[spin_1.5s_linear_infinite]'
                role='status'
            >
                <span
                    className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                >
                    Loading...
                </span>
            </div>

        </section>
    )

}

export default Loading;