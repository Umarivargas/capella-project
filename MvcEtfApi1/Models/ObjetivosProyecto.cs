//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace MvcEtfApi1.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class ObjetivosProyecto
    {
        public int IdObjProyecto { get; set; }
        public int Fk_Objetivo { get; set; }
        public int Fk_Proyecto { get; set; }
    
        public virtual Objetivo Objetivo { get; set; }
        public virtual Proyecto Proyecto { get; set; }
    }
}
