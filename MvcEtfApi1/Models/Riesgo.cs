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
    
    public partial class Riesgo
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Riesgo()
        {
            this.RiesgosObjetivoes = new HashSet<RiesgosObjetivo>();
        }
    
        public int IdRiesgo { get; set; }
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public int Categoria { get; set; }
        public int Probabilidad { get; set; }
        public int Impacto { get; set; }
        public Nullable<int> IdObjetivo { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<RiesgosObjetivo> RiesgosObjetivoes { get; set; }
    }
}