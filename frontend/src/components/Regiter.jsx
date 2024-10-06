// import { response } from 'express';
import React, { useState } from 'react'


const arr = [
    {
        label:"Name",
        name:'name',
        type:"text",
        value:'',
        id:'name',
        htmlFor:"name"
    },
    {
        label:"Email",
        name:'email',
        type:"email",
        value:'',
        id:'email',
        htmlFor:"email"
    }
]
function Regiter() {
    const initialPerson = arr.reduce((acc , val)=>{return{...acc,[val.name]:val.value}},{})
    
  const [person , setPerson] = useState(initialPerson);

  const handleChange = (e)=>{
    const {name ,value} = e.target;
    // console.log(name , value)
    setPerson({...person,[name]:value})
  }
  const handleSubmit = async(e)=>{
    e.preventDefault()
    console.log(person)
   try {
    const response = await fetch(`http://localhost:3000/api/v1/user/register`,{
        method:'POST',
         headers:{
           'Content-Type':'application/json'
        },
        body:JSON.stringify(person)
    },
    
    console.log(response)
)
   } catch (error) {
    console.log(error)
   }
setPerson(initialPerson)
  }
    return(<>
    
    <form  onSubmit= {handleSubmit} action="POST">
        {arr.map((val,index)=>{
            return(<>
            <div key={index}>
                <label htmlFor={val.htmlFor}>{val.label}</label>
                <input type={val.type} id={val.id} name={val.name} value={person[arr.name]} onChange={handleChange}/>
            </div>
            </>)
        })}
        <button type='submit'>Submit</button>
    </form>
    </>)
}

export default Regiter