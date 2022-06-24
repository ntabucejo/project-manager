import { MenuIcon } from '@heroicons/react/outline'
import Icon from './icon/icon'
import Linker from './link/link'
import { useState } from 'react'
import Button from './button/button'
import Link from 'next/link'

interface IProps {
  fullname?: string
  firstName?: string
  lastName?: string
  image?: string
  id: string
}

const Header = ({ fullname, firstName, lastName, image, id }: IProps) => {
  const [open, setOpen] = useState(false)

  return (
    <header>
      <div className="area bg-white shadow-md shadow-violet grid grid-flow-col items-center">
        <h1 className="font-bold text-blue text-sm md:text-lg whitespace-nowrap">
          PCU Teams
        </h1>

        <div className="ml-auto md:hidden">
          <div className="relative grid grid-flow-col items-center gap-6">
            {/* name */}
            <h1 className="text-sm text-blue font-semibold">
              Hi!{' '}
              <span className="font-bold">
                {firstName} {lastName}
              </span>
            </h1>

            {/* profile */}
            <div className="w-10 h-10 border-[1px] border-gray-200 rounded-full grid items-center justify-center">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            </div>

            {/* logout */}
            <button onClick={() => setOpen(!open)}>
              <Icon icon={<MenuIcon />} />
            </button>
          </div>

          {open && (
            <div className="absolute right-5 z-50 bg-white shadow-md shadow-gray-200 grid items-center">
              <div className="hover:bg-snow px-5 py-3 transition-all duration-500">
                <Linker name={'All Projects'} link={`/connect/${id}`} />
              </div>
              <div className="hover:bg-snow px-5 py-3 transition-all duration-500">
                <Linker name={'Logout'} link={'/'} />{' '}
              </div>
            </div>
          )}
        </div>

        <div className="hidden md:block md:ml-auto">
          <div className="grid grid-flow-col gap-6 items-center ">
            <div className="group relative text-blue font-semibold">
              <Linker name={'All Projects'} link={'/'} />
              <div className="absolute w-0 h-1 bg-blue group-hover:w-full transition-all duration-500 ease-in-out"></div>
            </div>

            {/* name */}
            <h1 className="text-sm text-blue font-semibold">
              Hi! <span className="font-bold">{fullname}</span>
            </h1>

            {/* user profile */}
            <div className="w-10 h-10 border-[1px] border-gray-200 rounded-full grid items-center justify-center">
              <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden">
                <img className="w-full" src={image} alt="" />
              </div>
            </div>

            <Button name={'Logout'} color={'bg-pink'} />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
