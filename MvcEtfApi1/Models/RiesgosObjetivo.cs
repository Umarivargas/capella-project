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
    
    public partial class RiesgosObjetivo
    {
        public int IdRiesgosObjetivo { get; set; }
        public int Fk_Riesgo { get; set; }
        public int Fk_Objetivo { get; set; }
    
        public virtual Objetivo Objetivo { get; set; }
        public virtual Riesgo Riesgo { get; set; }
    }
}
