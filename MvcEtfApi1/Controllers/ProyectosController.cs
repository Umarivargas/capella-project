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
    public class ProyectosController : ApiController
    {
        private AnalisisRiesgosConnect db = new AnalisisRiesgosConnect();

        // GET: api/Proyectos
        public IQueryable<Proyecto> GetProyectoes()
        {
            return db.Proyectoes;
        }

        // GET: api/Proyectos/5
        [ResponseType(typeof(Proyecto))]
        public IHttpActionResult GetProyecto(int id)
        {
            Proyecto proyecto = db.Proyectoes.Find(id);
            if (proyecto == null)
            {
                return NotFound();
            }

            return Ok(proyecto);
        }

        // PUT: api/Proyectos/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutProyecto(int id, Proyecto proyecto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != proyecto.IdProyecto)
            {
                return BadRequest();
            }

            db.Entry(proyecto).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProyectoExists(id))
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

        // POST: api/Proyectos
        [ResponseType(typeof(Proyecto))]
        public IHttpActionResult PostProyecto(Proyecto proyecto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Proyectoes.Add(proyecto);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = proyecto.IdProyecto }, proyecto);
        }

        // DELETE: api/Proyectos/5
        [ResponseType(typeof(Proyecto))]
        public IHttpActionResult DeleteProyecto(int id)
        {
            Proyecto proyecto = db.Proyectoes.Find(id);
            if (proyecto == null)
            {
                return NotFound();
            }

            db.Proyectoes.Remove(proyecto);
            db.SaveChanges();

            return Ok(proyecto);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool ProyectoExists(int id)
        {
            return db.Proyectoes.Count(e => e.IdProyecto == id) > 0;
        }
    }
}