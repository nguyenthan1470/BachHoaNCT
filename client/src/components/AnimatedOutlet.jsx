// import { useLocation, Outlet } from 'react-router-dom'
// import { CSSTransition, TransitionGroup } from 'react-transition-group'
// import { useRef } from 'react'

// const AnimatedOutlet = () => {
//     const location = useLocation()
//     const nodeRef = useRef(null)

//     return (
//         <TransitionGroup component={null}>
//             <CSSTransition
//                 key={location.pathname}
//                 classNames="curtain" 
//                 timeout={900}
//                 nodeRef={nodeRef}
//             >
//                 <div ref={nodeRef} className="page-transition">
//                     <Outlet />
//                 </div>
//             </CSSTransition>
//         </TransitionGroup>
//     )
// }

// export default AnimatedOutlet
