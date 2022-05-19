import React from "react";

class Navbar extends React.Component{
    render(){
        return(
            <div className="navWrapper">
            <div className="navContainer">
        <div className="navLogo"><img src="psaLogo.png"/><span>PSA</span><i className="fa fa-navicon "></i></div>
        <div className="navLinks">
            <a href="/"><i className="fa fa-pie-chart"></i><span>Diagnostics</span></a>
            <a href="/History"><i className="fa fa-archive"></i><span>History</span></a>
            <a><i className="fa fa-users"></i><span>Contact Us</span></a>
            <hr id="nav_partition" />
            <a><i className="fa fa-gear"></i><span>Settings</span></a>
        </div>
    </div>
    </div>
        );
    }
    componentDidMount(){
        var nav_hover = null;
        var hiddenElements = [];
        var navContainer = document.getElementsByClassName('navContainer')[0];
        var navLinks = document.getElementsByClassName('navLinks')[0];
        function navMouseover() {
            nav_hover = setTimeout(() => {
                [...this.children].forEach(element => {
                    [...element.children].forEach(child_element => {
                        if (window.getComputedStyle(child_element).display === "none" && !child_element.classList.contains("fa-navicon")) {
                            hiddenElements.push(child_element);
                            child_element.style.display = 'flex';
                        }
                        [...child_element.children].forEach(grandChild_element => {
                            if (window.getComputedStyle(grandChild_element).display === "none") {
        
                                hiddenElements.push(grandChild_element);
                                grandChild_element.style.display = 'flex';
                            }
                        });
                    });
                });
            }, 190);
        }
        function navMouseLeave() {
            clearTimeout(nav_hover);
            if (hiddenElements.length > 0) {
                hiddenElements.forEach(hiddenEl => {
                    hiddenEl.style.display = 'none';
                });
                hiddenElements = [];
            }
        }
        function navMouseOut() {
            clearTimeout(nav_hover);
        }
        function navClick() {
            if (navLinks.style.display === "none") {
                if (document.getElementsByClassName('clickaway_background').length === 0) {
                    var clickaway = document.createElement('div');
                    clickaway.classList.add("clickaway_background");
                    document.body.appendChild(clickaway);
                }
                else {
                    document.getElementsByClassName('clickaway_background')[0].style.display = "block";
                }
                navLinks.style.display = "block";
                setTimeout(() => {
                    navLinks.style.height = "190px";
                }, 50);
                setTimeout(() => {
                    document.querySelectorAll(".navLinks a").forEach(element => {
                        element.style.display = "flex";
                    });
                }, 250);
            }
            else {
                document.querySelectorAll(".navLinks a").forEach(element => {
                    element.style.display = "none";
                });
                setTimeout(() => {
                    navLinks.style.height = "0px";
                }, 200);
                navLinks.style.display = "none";
                if (document.getElementsByClassName('clickaway_background').length > 0) {
                    document.getElementsByClassName('clickaway_background')[0].style.display = "none";
                }
            }
            if (document.getElementsByClassName('clickaway_background').length > 0) {
                document.getElementsByClassName('clickaway_background')[0].addEventListener('click', function () {
                    document.querySelectorAll(".navLinks a").forEach(element => {
                        element.style.display = "none";
                    });
                    setTimeout(() => {
                        navLinks.style.height = "0px";
                    }, 200);
                    navLinks.style.display = "none";
                    this.style.display = "none";
                });
            }
        }
        function sidebar_proc() {
            var navPartition = document.getElementById("nav_partition");
            navContainer.getElementsByTagName('span')[0].style.display = "none";
            if (!window.matchMedia("(max-width: 1100px)").matches) {
                document.getElementsByClassName("fa-navicon")[0].removeEventListener('click', navClick);
                document.querySelectorAll(".navLinks a").forEach(element => {
                    element.style.display = "flex";
                });
                navPartition.style.display = "flex";
                if (document.getElementsByClassName('clickaway_background').length > 0) {
                    if (window.getComputedStyle(document.getElementsByClassName('clickaway_background')[0], null).display === "block") {
                        document.getElementsByClassName('clickaway_background')[0].style.display = "none";
                    }
                }
                var navlink_tag = document.querySelectorAll(".navLinks a span");
                [...navlink_tag].forEach(element => {
                    element.style.display = "none";
                });
                navLinks.style.display = "block";
                navLinks.style.height = "100%";
                navContainer.addEventListener('mouseover', navMouseover);
                navContainer.addEventListener('mouseleave', navMouseLeave);
                navContainer.addEventListener('mouseout', navMouseOut);
            }
            else {
                navContainer.removeEventListener('mouseover', navMouseover);
                navContainer.removeEventListener('mouseleave', navMouseLeave);
                navContainer.removeEventListener('mouseout', navMouseOut);
        
                navContainer.getElementsByTagName('span')[0].style.display = "flex";
                navPartition.style.display = "none";
                navLinks.style.height = 0;
                navLinks.style.display = "none";
                document.querySelectorAll(".navLinks a").forEach(element => {
                    element.style.display = "none"
                });
                navlink_tag = document.querySelectorAll('.navLinks a span');
                [...navlink_tag].forEach(element => {
                    if (element.style.display == "none") {
                        element.style.display = "flex";
                    }
                });
                document.getElementsByClassName("fa-navicon")[0].addEventListener('click', navClick);
            }
        }
        sidebar_proc();
        window.addEventListener('resize', sidebar_proc);        
    }

    
}
export default Navbar