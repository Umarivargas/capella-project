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
    public class ObjetivosProyectosController : ApiController
    {
        private AnalisisRiesgosConnect db = new AnalisisRiesgosConnect();

        // GET: api/ObjetivosProyectos
        public IQueryable<ObjetivosProyecto> GetObjetivosProyectoes()
        {
            return db.ObjetivosProyectoes;
        }

        // GET: api/ObjetivosProyectos/5
        [ResponseType(typeof(ObjetivosProyecto))]
        public IHttpActionResult GetObjetivosProyecto(int id)
        {
            ObjetivosProyecto objetivosProyecto = db.ObjetivosProyectoes.Find(id);
            if (objetivosProyecto == null)
            {
                return NotFound();
            }

            return Ok(objetivosProyecto);
        }

        // PUT: api/ObjetivosProyectos/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutObjetivosProyecto(int id, ObjetivosProyecto objetivosProyecto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != objetivosProyecto.IdObjProyecto)
            {
                return BadRequest();
            }

            db.Entry(objetivosProyecto).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ObjetivosProyectoExists(id))
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

        // POST: api/ObjetivosProyectos
        [ResponseType(typeof(ObjetivosProyecto))]
        public IHttpActionResult PostObjetivosProyecto(ObjetivosProyecto objetivosProyecto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.ObjetivosProyectoes.Add(objetivosProyecto);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = objetivosProyecto.IdObjProyecto }, objetivosProyecto);
        }

        // DELETE: api/ObjetivosProyectos/5
        [ResponseType(typeof(ObjetivosProyecto))]
        public IHttpActionResult DeleteObjetivosProyecto(int id)
        {
            ObjetivosProyecto objetivosProyecto = db.ObjetivosProyectoes.Find(id);
            if (objetivosProyecto == null)
            {
                return NotFound();
            }

            db.ObjetivosProyectoes.Remove(objetivosProyecto);
            db.SaveChanges();

            return Ok(objetivosProyecto);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool ObjetivosProyectoExists(int id)
        {
            return db.ObjetivosProyectoes.Count(e => e.IdObjProyecto == id) > 0;
        }
    }
}