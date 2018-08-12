using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using MvcEtfApi1.Models;

namespace MvcEtfApi1.Controllers
{
    public class ProyectosEmpresasController : ApiController
    {
        private AnalisisRiesgosConnect db = new AnalisisRiesgosConnect();

        // GET: api/ProyectosEmpresas
        public IQueryable<ProyectosEmpresa> GetProyectosEmpresas()
        {
            return db.ProyectosEmpresas;
        }

        // GET: api/ProyectosEmpresas/5
        [ResponseType(typeof(ProyectosEmpresa))]
        public IHttpActionResult GetProyectosEmpresa(int id)
        {
            ProyectosEmpresa proyectosEmpresa = db.ProyectosEmpresas.Find(id);
            if (proyectosEmpresa == null)
            {
                return NotFound();
            }

            return Ok(proyectosEmpresa);
        }

        // PUT: api/ProyectosEmpresas/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutProyectosEmpresa(int id, ProyectosEmpresa proyectosEmpresa)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != proyectosEmpresa.Id)
            {
                return BadRequest();
            }

            db.Entry(proyectosEmpresa).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProyectosEmpresaExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/ProyectosEmpresas
        [ResponseType(typeof(ProyectosEmpresa))]
        public IHttpActionResult PostProyectosEmpresa(ProyectosEmpresa proyectosEmpresa)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.ProyectosEmpresas.Add(proyectosEmpresa);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = proyectosEmpresa.Id }, proyectosEmpresa);
        }

        // DELETE: api/ProyectosEmpresas/5
        [ResponseType(typeof(ProyectosEmpresa))]
        public IHttpActionResult DeleteProyectosEmpresa(int id)
        {
            ProyectosEmpresa proyectosEmpresa = db.ProyectosEmpresas.Find(id);
            if (proyectosEmpresa == null)
            {
                return NotFound();
            }

            db.ProyectosEmpresas.Remove(proyectosEmpresa);
            db.SaveChanges();

            return Ok(proyectosEmpresa);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool ProyectosEmpresaExists(int id)
        {
            return db.ProyectosEmpresas.Count(e => e.Id == id) > 0;
        }
    }
}