import { NavLink } from 'react-router-dom';

import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import KeyboardTabIcon from '@mui/icons-material/KeyboardTab';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';

export default function Home() {
    return (
        <div className="bg-white h-screen flex items-center justify-center">
            
            <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
                <a href="https://github.com/romulodm/go-chess-ws" target='_blank' className="inline-flex ustify-between items-center py-1 px-1 pr-4 mb-7 text-sm text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200" role="alert">
                    <span className="text-xs bg-blue-700 rounded-full text-white sm:px-4 px-2.5 py-1.5 mr-3">
                        Repository
                    </span>

                    <span className="sm:text-sm text-xs font-medium">
                    Support the project! Leave a star
                    </span>

                    <KeyboardArrowRightRoundedIcon/>
                </a>

                <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl">
                    A new way to play 
                    <span> </span>
                    <span className="inset-0 bg-gradient-to-r from-blue-700 via-purple-700 to-blue-700 bg-clip-text text-transparent">
                        chess
                    </span>
                </h1>
                <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48">
                A simple project made to use new technologies, have fun playing chess with friends!
                </p>
                <div className="flex flex-col w-full mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
                    <a href="https://github.com/romulodm/go-chess-ws/blob/main/README.md" target='_blank' className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-gray-900 rounded-lg border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100">
                        <DescriptionOutlinedIcon style={{marginRight: '8px'}}/>
                        Learn more
                    </a>

                <NavLink to="/game">
                    <button  
                        className="inline-flex w-full hover:bg-blue-600 justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300"
                    >
                        Play game
                        <KeyboardTabIcon style={{marginLeft: '8px'}}/>
                    </button>
                </NavLink>

                </div>
            </div>
        </div>
    )
};