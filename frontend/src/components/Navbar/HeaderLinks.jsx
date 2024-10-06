import React from 'react'
import { NavLink } from "react-router-dom";

export default function HeaderLinks() {
  return (
 <>
 {[
            { link: "Home", path: "/" },
            { link: "About", path: "/about" },
            { link: "Services", path: "/services" },
            { link: "Feedback", path: "/feedback" },
          ].map((elem) => {
            return (
              <>
                <NavLink to={elem.path}>{elem.link}</NavLink>
              </>
            );
          })}
 
 </>
  )
}
