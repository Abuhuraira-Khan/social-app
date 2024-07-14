import React, { useState } from 'react';
import { RxCross2 } from 'react-icons/rx';

const Notice = () => {

    const [hide, setHide] = useState(false)

  return (
    <div className={`fixed w-screen h-screen top-0 left-0 bg-black-rgba z-50 flex ${hide?'hidden':''} justify-center items-center`}>
      <div className='w-96 h-96 shadow-2xl bg-white p-2 px-5'>
        <div className='flex justify-end items-center h-5'>
          <button onClick={()=>setHide(true)} className='hover:bg-slate-200 p-1 rounded-full'>
            <RxCross2 size={25} />
          </button>
        </div>
        <h1 className='text-center text-2xl font-bold capitalize'>Important Details</h1>
        <div className='py-2'>
          <p>This website is created only for <mark>project demonstration</mark>.</p>
          <p>It is an <mark>unfinished</mark> website.</p>
          <p>Currently, only some features are available:</p>
          <ul className='list-disc ml-5'>
            <li><code className='bg-black text-white px-1'>Sign up</code> & <code className='bg-black text-white px-1'>login</code></li>
            <li><code className='bg-black text-white px-1'>Add</code> & <code className='bg-black text-white px-1'>delete</code> post</li>
            <li><code className='bg-black text-white px-1'>Like</code> & <code className='bg-black text-white px-1'>unlike</code> post</li>
            <li><code className='bg-black text-white px-1'>Add</code> & <code className='bg-black text-white px-1'>delete</code> comment</li>
            <li>Change <code className='bg-black text-white px-1'>profile pic</code>, <code className='bg-black text-white px-1'>cover pic</code>, <code className='bg-black text-white px-1'>bio</code></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Notice;
